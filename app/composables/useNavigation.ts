/**
 * Centralized navigation helper.
 * - Always go through here for route changes to keep behavior consistent.
 * - You can add logging, guards, query merging, etc. later in one place.
 */
export const useNavigation = () => {
  const router = useRouter()

  /**
   * Navigate to a target.
   * Accepts the same input as navigateTo/useRouter.push.
   */
  const go = async (to: string | Parameters<typeof router.push>[0]) => {
    // Wrap in try-catch so navigation failures don’t throw uncaught errors.
    try {
      return await router.push(to)
    } catch (err) {
      console.error('[navigation] failed to navigate', to, err)
      return err
    }
  }

  return { go }
}


