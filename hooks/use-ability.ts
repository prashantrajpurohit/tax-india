import { AbilityContext } from '@/config/contexts/acl-context'
import { useContext } from 'react'
export const useAbility = () => useContext(AbilityContext)