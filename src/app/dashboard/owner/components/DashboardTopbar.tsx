"use client";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import type { Notification } from "@/services/notification";
import { initials } from "../../_shared/dashboard.utils";
import { TopbarNotifications } from "./TopbarNotifications";
import { TopbarSearch } from "./TopbarSearch";

type DashboardTopbarProps = {
  userName: string;
  userAvatar?: string | null;
  services: string[];
  initialNotifications: Notification[];
};

export const DashboardTopbar = ({
  userName,
  userAvatar,
  services,
  initialNotifications,
}: DashboardTopbarProps) => (
  <header className="dashboard__topbar dashboard-shell__topbar">
    <div className="dashboard__topbar-container dashboard-topbar">
      <TopbarSearch services={services} />

      <div className="dashboard-topbar__actions">
        <TopbarNotifications initialNotifications={initialNotifications} />
        <Avatar className="dashboard-topbar__avatar">
          <AvatarImage
            src={
              userAvatar ||
              `https://i.pravatar.cc/80?u=${encodeURIComponent(userName)}`
            }
            alt={userName}
          />
          <AvatarFallback>{initials(userName)}</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <span className="dashboard-topbar__user-name">{userName}</span>
      </div>
    </div>
  </header>
);
