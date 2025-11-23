export type Subscription = {
  status: string
  plan_id: string
  price_id: string
  cancel_at_period_end: boolean
  current_period_end: string | null
  current_period_start?: string | null
  trial_end?: string | null
  stripe_subscription_id?: string | null
}

export type AppItem = {
  id: number
  name: string
  description?: string
  role: string
}

export type Collaborator = {
  user: number
  email: string
  role: string
  invited_at: string
}

export type AdminUser = {
  id: number
  email: string
  user_type: string
  is_active: boolean
  is_disabled_by_admin: boolean
  subscription_status?: string | null
  subscription_plan?: string | null
  owned_app_count: number
}
