import React from "react";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

export default function CheckinTab() {
  return (
    <Screen title="Check-in">
      <Card>
        <Text variant="body">
          Registra tu día para ajustar el plan y el coach.
        </Text>
      </Card>

      <Button
        label="Hacer check-in"
        onPress={() => {
          // ✅ Opción 1: si tu wizard vive en /checkin (carpeta fuera de tabs)
          router.push("/checkin");
        }}
      />

      <Button
        variant="ghost"
        label="Volver"
        onPress={() => router.push("/(tabs)")}
      />
    </Screen>
  );
}
