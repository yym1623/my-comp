export const useNavigation = () => {
  const router = useRouter()

  const go = async (to: string | Parameters<typeof router.push>[0]) => {

    try {
      return await router.push(to)
    } catch (err) {
      console.error('[navigation] failed to navigate', to, err)
      return err
    }
  }

  return { go }
}


