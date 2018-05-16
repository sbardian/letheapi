export const getUserInvitations = async (
  { id },
  args,
  { loaders: { getUserInvitationsLoader } },
) => getUserInvitationsLoader.load(id);
