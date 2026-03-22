import { create } from 'zustand'

export type Category = {
  id: string
  name: string
  slug: string
  image: string | null
}

export type AccountImage = {
  id: string
  url: string
  order: number
}

export type Account = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  shortPreview: string | null
  exchangeable: boolean
  categoryId: string
  images: AccountImage[]
  category?: Category
}

export type Page = 'home' | 'account' | 'admin' | 'admin-login'

type StoreState = {
  currentPage: Page
  selectedAccountId: string | null
  selectedCategory: string | null
  isAdmin: boolean
  categories: Category[]
  accounts: Account[]
  
  // Actions
  setCurrentPage: (page: Page) => void
  setSelectedAccountId: (id: string | null) => void
  setSelectedCategory: (slug: string | null) => void
  setIsAdmin: (isAdmin: boolean) => void
  setCategories: (categories: Category[]) => void
  setAccounts: (accounts: Account[]) => void
}

export const useStore = create<StoreState>((set) => ({
  currentPage: 'home',
  selectedAccountId: null,
  selectedCategory: null,
  isAdmin: false,
  categories: [],
  accounts: [],
  
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedAccountId: (id) => set({ selectedAccountId: id, currentPage: id ? 'account' : 'home' }),
  setSelectedCategory: (slug) => set({ selectedCategory: slug }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setCategories: (categories) => set({ categories }),
  setAccounts: (accounts) => set({ accounts }),
}))
