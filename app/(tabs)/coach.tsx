import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Screen, Text, Card, Input, Chip, Button } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import { useProfile, useTodayCheckin, useRecentCheckins } from '@/hooks';
import { computeFlags, generateCoachReply, CoachReply } from '@/lib/coach';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { CoachMessage } from '@/lib/types';

interface DisplayMessage {
  role: 'user' | 'assistant';
  content: string | CoachReply;
  timestamp: Date;
}

export default function CoachScreen() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { checkin } = useTodayCheckin();
  const { checkins } = useRecentCheckins(7);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const flags = computeFlags(checkins, checkin, profile);
  const tone = profile?.coach_tone || 'directo';

  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('coach_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    if (!data) return;

    const displayMessages: DisplayMessage[] = data.map(msg => {
      let content: string | CoachReply = msg.content;

      if (msg.role === 'assistant') {
        try {
          content = JSON.parse(msg.content);
        } catch (parseError) {
          console.error('Error parsing coach message:', parseError);
          content = {
            hechos: 'Error al cargar mensaje',
            interpretacion: '',
            accion: '',
            limite: msg.content || '',
          };
        }
      }

      return {
        role: msg.role as 'user' | 'assistant',
        content,
        timestamp: new Date(msg.created_at!),
      };
    });

    setMessages(displayMessages);
  };

  const saveMessage = async (role: 'user' | 'assistant', content: string | CoachReply) => {
    if (!user) return;

    const message: Omit<CoachMessage, 'id' | 'created_at'> = {
      user_id: user.id,
      role,
      content: typeof content === 'string' ? content : JSON.stringify(content),
    };

    await supabase.from('coach_messages').insert(message);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message to display
    const userDisplayMsg: DisplayMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userDisplayMsg]);

    // Save user message
    await saveMessage('user', userMessage);

    // Generate coach reply
    const reply = generateCoachReply(
      userMessage,
      flags,
      checkins,
      checkin,
      profile,
      tone
    );

    // Add assistant message to display
    const assistantDisplayMsg: DisplayMessage = {
      role: 'assistant',
      content: reply,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantDisplayMsg]);

    // Save assistant message
    await saveMessage('assistant', reply);

    setLoading(false);
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  const getFlagChips = () => {
    const chips: string[] = [];
    if (flags.fatigue_high) chips.push('Fatiga alta');
    if (flags.adherence_low) chips.push('Adherencia baja');
    if (flags.protein_low) chips.push('Proteína baja');
    if (flags.all_good) chips.push('Todo en orden');
    return chips;
  };

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <Text variant="h1" style={styles.header}>
          Coach
        </Text>

        {/* Context Bar */}
        <View style={styles.contextBar}>
          <Text variant="caption" color="textSecondary" style={styles.contextLabel}>
            Contexto
          </Text>
          <View style={styles.flagsContainer}>
            {getFlagChips().map((flag, index) => (
              <Chip key={index} label={flag} selected={false} style={styles.flagChip} />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity onPress={() => handleQuickAction('Qué hago hoy')}>
            <Text variant="body" color="primary">
              Qué hago hoy
            </Text>
          </TouchableOpacity>
          <Text variant="body" color="textSecondary"> • </Text>
          <TouchableOpacity onPress={() => handleQuickAction('Ajusta mi plan')}>
            <Text variant="body" color="primary">
              Ajusta mi plan
            </Text>
          </TouchableOpacity>
          <Text variant="body" color="textSecondary"> • </Text>
          <TouchableOpacity onPress={() => handleQuickAction('Resumen semanal')}>
            <Text variant="body" color="primary">
              Resumen semanal
            </Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map((msg, index) => (
            <View key={index} style={styles.messageWrapper}>
              {msg.role === 'user' ? (
                <Card style={styles.userMessage}>
                  <Text variant="body">{msg.content as string}</Text>
                </Card>
              ) : (
                <Card style={styles.assistantMessage}>
                  <View style={styles.replySection}>
                    <Text variant="body" style={styles.replyLabel}>
                      Hechos:
                    </Text>
                    <Text variant="body">{(msg.content as CoachReply).hechos}</Text>
                  </View>

                  <View style={styles.replySection}>
                    <Text variant="body" style={styles.replyLabel}>
                      Interpretación:
                    </Text>
                    <Text variant="body">{(msg.content as CoachReply).interpretacion}</Text>
                  </View>

                  <View style={styles.replySection}>
                    <Text variant="body" style={styles.replyLabel}>
                      Acción:
                    </Text>
                    <Text variant="body">{(msg.content as CoachReply).accion}</Text>
                  </View>

                  <View style={styles.replySection}>
                    <Text variant="body" style={styles.replyLabel}>
                      Límite:
                    </Text>
                    <Text variant="body" color="textSecondary">
                      {(msg.content as CoachReply).limite}
                    </Text>
                  </View>
                </Card>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <Input
            placeholder="Escribe tu pregunta…"
            value={input}
            onChangeText={setInput}
            style={styles.input}
            onSubmitEditing={handleSend}
          />
          <Button onPress={handleSend} loading={loading} style={styles.sendButton}>
            Enviar
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.gap,
  },
  contextBar: {
    marginBottom: spacing.gap,
  },
  contextLabel: {
    marginBottom: spacing.gap / 2,
  },
  flagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap / 2,
  },
  flagChip: {
    marginRight: spacing.gap / 2,
    marginBottom: spacing.gap / 2,
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.gap,
    flexWrap: 'wrap',
  },
  messagesContainer: {
    flex: 1,
    marginBottom: spacing.gap,
  },
  messageWrapper: {
    marginBottom: spacing.gap,
  },
  userMessage: {
    backgroundColor: colors.primarySubtle,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  replySection: {
    marginBottom: spacing.gap,
  },
  replyLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: spacing.gap,
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
  },
  sendButton: {
    width: 100,
  },
});
