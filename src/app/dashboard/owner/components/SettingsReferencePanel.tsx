"use client";

import type { Appointment } from "@/services/appointment";
import type { Payment } from "../owner.types";
import { buildProfileStats } from "../profile-settings.utils";
import {
  ProfileSettingsPanel,
  type ProfileSettingsData,
} from "./ProfileSettingsPanel";
import { PageHead } from "./ReferencePanelPrimitives";

export const SettingsReferencePanel = ({
  profile,
  appointments,
  payments,
}: {
  profile: ProfileSettingsData;
  appointments: Appointment[];
  payments: Payment[];
}) => (
  <div className="reference-page dashboard-page dashboard-page--settings settings-page">
    <PageHead
      title="Configurações"
      subtitle="Gerencie sua conta e a segurança de acesso"
      action=""
    />
    <ProfileSettingsPanel
      profile={profile}
      stats={buildProfileStats(appointments, payments)}
    />
  </div>
);
