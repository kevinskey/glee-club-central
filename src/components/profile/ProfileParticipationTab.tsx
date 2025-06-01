
import React from 'react';
import { EnhancedParticipationTab } from './EnhancedParticipationTab';

interface ProfileParticipationTabProps {
  profile: any;
}

export const ProfileParticipationTab: React.FC<ProfileParticipationTabProps> = ({ profile }) => {
  return <EnhancedParticipationTab profile={profile} />;
};
