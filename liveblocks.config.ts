declare global {
  interface Liveblocks {
    UserMeta: {
      id: string;
      info: {
        name: string;
        avatar: string;
        color: string;
      };
    };
    ActivitiesData: {
      $workstreamRequestAccess: {
        title: string;
        status: "RequestPending" | "RequestApproved" | "RequestDenied";
        message: string;
        workstreamUuid: string;
        participantUuid: string;
        workstreamTitle: string;
        requesterProfileUuid: string;
        requesterProfileImage: string;
      };
    };
  }
}

export {};
