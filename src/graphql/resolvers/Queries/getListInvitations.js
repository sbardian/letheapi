export const getListInvitations = async (
  { id },
  args,
  { loaders: { getListInvitationsLoader } },
) => getListInvitationsLoader.load(id);
