'use client'

import { useEffect, useState, useCallback } from 'react'
import { useStore, type Category, type Account, type AccountImage, type Page } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Gamepad2, 
  Menu, 
  X, 
  Shield, 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowLeft, 
  MessageCircle,
  RefreshCw,
  Image as ImageIcon,
  LogOut,
  LayoutGrid,
  List,
  Search,
  Filter
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

// Header Component
function Header() {
  const { currentPage, setCurrentPage, isAdmin, setIsAdmin, setSelectedAccountId, setSelectedCategory } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (page: Page) => {
    if (page === 'home') {
      setSelectedAccountId(null)
      setSelectedCategory(null)
    }
    setCurrentPage(page)
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setCurrentPage('home')
    setSelectedAccountId(null)
    toast.success('Logged out successfully')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Gamepad2 className="h-8 w-8 text-emerald-500" />
          <span className="text-xl font-bold">Mohamed Mg</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button 
            variant={currentPage === 'home' ? 'default' : 'ghost'}
            onClick={() => handleNavClick('home')}
          >
            Home
          </Button>
          {!isAdmin ? (
            <Button 
              variant="outline"
              onClick={() => setCurrentPage('admin-login')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin
            </Button>
          ) : (
            <>
              <Button 
                variant={currentPage === 'admin' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('admin')}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto flex flex-col gap-2 p-4">
            <Button 
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => handleNavClick('home')}
              className="justify-start"
            >
              Home
            </Button>
            {!isAdmin ? (
              <Button 
                variant="outline"
                onClick={() => {
                  setCurrentPage('admin-login')
                  setMobileMenuOpen(false)
                }}
                className="justify-start"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            ) : (
              <>
                <Button 
                  variant={currentPage === 'admin' ? 'default' : 'ghost'}
                  onClick={() => handleNavClick('admin')}
                  className="justify-start"
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="outline" onClick={handleLogout} className="justify-start">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-emerald-500" />
            <span className="font-semibold">Mohamed Mg</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mohamed Mg. All rights reserved.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://www.facebook.com/mohamed.ghjghb.1', '_blank')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Us
          </Button>
        </div>
      </div>
    </footer>
  )
}

// Account Card Component
function AccountCard({ account }: { account: Account }) {
  const { setSelectedAccountId } = useStore()
  const firstImage = account.images?.[0]?.url || '/placeholder.png'

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]"
      onClick={() => setSelectedAccountId(account.id)}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={firstImage}
          alt={account.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.png'
          }}
        />
        {account.exchangeable && (
          <Badge className="absolute top-2 right-2 bg-emerald-500">
            <RefreshCw className="h-3 w-3 mr-1" />
            Exchangeable
          </Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg line-clamp-1">{account.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {account.shortPreview || account.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-lg font-bold text-emerald-600">
          {account.price.toFixed(2)} TND
        </span>
        {account.category && (
          <Badge variant="secondary">{account.category.name}</Badge>
        )}
      </CardFooter>
    </Card>
  )
}

// StorePage Component
function StorePage() {
  const { categories, accounts, selectedCategory, setSelectedCategory, isAdmin, setCurrentPage } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredAccounts = accounts.filter(account => {
    const matchesCategory = !selectedCategory || account.categoryId === selectedCategory
    const matchesSearch = !searchQuery || 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome to <span className="text-emerald-500">Mohamed Mg</span>
        </h1>
        <p className="text-muted-foreground">
          Your trusted source for premium game accounts
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory || 'all'} onValueChange={(v) => setSelectedCategory(v === 'all' ? null : v)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={!selectedCategory ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Accounts Grid/List */}
      {filteredAccounts.length === 0 ? (
        <div className="text-center py-12">
          <Gamepad2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No accounts found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory 
              ? 'Try adjusting your filters'
              : 'Check back later for new accounts'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAccounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAccounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}

      {/* Admin Quick Access */}
      {!isAdmin && (
        <div className="mt-12 text-center">
          <Button variant="outline" onClick={() => setCurrentPage('admin-login')}>
            <Shield className="h-4 w-4 mr-2" />
            Admin Panel
          </Button>
        </div>
      )}
    </div>
  )
}

// Account Details Page
function AccountDetailsPage() {
  const { selectedAccountId, setSelectedAccountId, accounts } = useStore()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  const account = accounts.find(a => a.id === selectedAccountId)

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Account not found</h2>
        <Button onClick={() => setSelectedAccountId(null)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    )
  }

  const images = account.images?.length > 0 ? account.images : [{ id: '1', url: '/placeholder.png', order: 0 }]

  return (
    <div className="container mx-auto px-4 py-6">
      <Button 
        variant="ghost" 
        onClick={() => setSelectedAccountId(null)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Accounts
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
            <img
              src={images[selectedImageIndex]?.url || '/placeholder.png'}
              alt={account.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.png'
              }}
            />
            {account.exchangeable && (
              <Badge className="absolute top-4 right-4 bg-emerald-500 text-white">
                <RefreshCw className="h-3 w-3 mr-1" />
                Exchangeable
              </Badge>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? 'border-emerald-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${account.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.png'
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{account.name}</h1>
            {account.category && (
              <Badge variant="secondary" className="mb-4">{account.category.name}</Badge>
            )}
          </div>

          <div className="text-4xl font-bold text-emerald-600">
            {account.price.toFixed(2)} TND
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {account.description}
            </p>
          </div>

          {account.exchangeable && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <RefreshCw className="h-5 w-5" />
                <span className="font-medium">This account is available for exchange</span>
              </div>
            </div>
          )}

          <Button 
            size="lg" 
            className="w-full bg-emerald-500 hover:bg-emerald-600"
            onClick={() => window.open('https://www.facebook.com/mohamed.ghjghb.1', '_blank')}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Contact Seller
          </Button>
        </div>
      </div>
    </div>
  )
}

// Admin Login Page
function AdminLoginPage() {
  const { setIsAdmin, setCurrentPage } = useStore()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple password check
    if (password === 'mahmoud2020') {
      setIsAdmin(true)
      setCurrentPage('admin')
      toast.success('Welcome to Admin Panel')
    } else {
      setError('Invalid password')
      toast.error('Invalid password')
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
            <Shield className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <Button 
            variant="ghost" 
            className="w-full mt-4"
            onClick={() => setCurrentPage('home')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Admin Panel
function AdminPanel() {
  const { categories, accounts, isAdmin, setCurrentPage, setCategories, setAccounts } = useStore()
  const [activeTab, setActiveTab] = useState<'accounts' | 'categories'>('accounts')
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  
  // Account form state
  const [accountForm, setAccountForm] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    shortPreview: '',
    categoryId: '',
    exchangeable: false,
    images: [] as File[]
  })
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [accountDialogOpen, setAccountDialogOpen] = useState(false)
  
  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    image: null as File | null
  })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  // Check if admin
  useEffect(() => {
    if (!isAdmin) {
      setCurrentPage('admin-login')
    }
  }, [isAdmin, setCurrentPage])

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const [catRes, accRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/accounts')
      ])
      const catData = await catRes.json()
      const accData = await accRes.json()
      setCategories(catData.categories || [])
      setAccounts(accData.accounts || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    }
  }, [setCategories, setAccounts])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Category handlers
  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast.error('Category name is required')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', categoryForm.name)
      if (categoryForm.image) {
        formData.append('image', categoryForm.image)
      }

      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        body: formData
      })

      if (res.ok) {
        toast.success(editingCategory ? 'Category updated' : 'Category created')
        setCategoryDialogOpen(false)
        setCategoryForm({ id: '', name: '', image: null })
        setEditingCategory(null)
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to save category')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
    setLoading(false)
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Category deleted')
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete category')
      }
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  // Account handlers
  const handleSaveAccount = async () => {
    if (!accountForm.name.trim() || !accountForm.description.trim() || !accountForm.price || !accountForm.categoryId) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', accountForm.name)
      formData.append('description', accountForm.description)
      formData.append('price', accountForm.price)
      formData.append('shortPreview', accountForm.shortPreview)
      formData.append('categoryId', accountForm.categoryId)
      formData.append('exchangeable', String(accountForm.exchangeable))
      
      accountForm.images.forEach((img, index) => {
        formData.append('images', img)
      })

      const url = editingAccount ? `/api/accounts/${editingAccount.id}` : '/api/accounts'
      const method = editingAccount ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        body: formData
      })

      if (res.ok) {
        toast.success(editingAccount ? 'Account updated' : 'Account created')
        setAccountDialogOpen(false)
        setAccountForm({
          id: '',
          name: '',
          description: '',
          price: '',
          shortPreview: '',
          categoryId: '',
          exchangeable: false,
          images: []
        })
        setEditingAccount(null)
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to save account')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
    setLoading(false)
  }

  const handleDeleteAccount = async (id: string) => {
    try {
      const res = await fetch(`/api/accounts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Account deleted')
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete account')
      }
    } catch (error) {
      toast.error('Failed to delete account')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedAccounts.length === 0) {
      toast.error('No accounts selected')
      return
    }

    try {
      const res = await fetch('/api/accounts/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedAccounts })
      })

      if (res.ok) {
        toast.success(`${selectedAccounts.length} accounts deleted`)
        setSelectedAccounts([])
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete accounts')
      }
    } catch (error) {
      toast.error('Failed to delete accounts')
    }
  }

  const toggleSelectAll = () => {
    if (selectedAccounts.length === accounts.length) {
      setSelectedAccounts([])
    } else {
      setSelectedAccounts(accounts.map(a => a.id))
    }
  }

  const toggleSelectAccount = (id: string) => {
    setSelectedAccounts(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

const openAccountDialog = (account?: Account) => {
  if (account) {
    setEditingAccount(account)
    setAccountForm({
      id: account.id,
      name: account.name,
      description: account.description,
      price: account.price.toString(),
      shortPreview: account.shortPreview || '',
      categoryId: account.categoryId,
      exchangeable: account.exchangeable,
      imageUrls: account.images?.map(img => img.url) || [],
      uploadingImages: false
    })
  } else {
    setEditingAccount(null)
    setAccountForm({
      id: '',
      name: '',
      description: '',
      price: '',
      shortPreview: '',
      categoryId: categories[0]?.id || '',
      exchangeable: false,
      imageUrls: [],
      uploadingImages: false
    })
  }
  setAccountDialogOpen(true)
}

  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setCategoryForm({
        id: category.id,
        name: category.name,
        image: null
      })
    } else {
      setEditingCategory(null)
      setCategoryForm({ id: '', name: '', image: null })
    }
    setCategoryDialogOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button variant="outline" onClick={() => setCurrentPage('home')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Store
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'accounts' ? 'default' : 'outline'}
          onClick={() => setActiveTab('accounts')}
        >
          Accounts ({accounts.length})
        </Button>
        <Button
          variant={activeTab === 'categories' ? 'default' : 'outline'}
          onClick={() => setActiveTab('categories')}
        >
          Categories ({categories.length})
        </Button>
      </div>

      {activeTab === 'categories' && (
        <div className="space-y-4">
          <Button onClick={() => openCategoryDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  {category.image && (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-24 object-cover rounded mb-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                  <Badge variant="secondary">
                    {accounts.filter(a => a.categoryId === category.id).length} accounts
                  </Badge>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button size="sm" variant="outline" onClick={() => openCategoryDialog(category)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{category.name}&quot;? All accounts in this category will also be deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Button onClick={() => openAccountDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
            {selectedAccounts.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected ({selectedAccounts.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Bulk Delete Accounts</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedAccounts.length} selected accounts? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {accounts.length > 0 && (
            <div className="flex items-center gap-2 border rounded-lg p-3 bg-muted/50">
              <Checkbox
                checked={selectedAccounts.length === accounts.length}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
          )}

          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-3 pr-4">
              {accounts.map((account) => (
                <Card key={account.id} className={selectedAccounts.includes(account.id) ? 'border-emerald-500' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedAccounts.includes(account.id)}
                        onCheckedChange={() => toggleSelectAccount(account.id)}
                        className="mt-1"
                      />
                      <div className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                        {account.images?.[0]?.url ? (
                          <img
                            src={account.images[0].url}
                            alt={account.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.png'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium truncate">{account.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {account.shortPreview || account.description}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-emerald-600">{account.price.toFixed(2)} TND</p>
                            {account.exchangeable && (
                              <Badge variant="secondary" className="mt-1">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Exchange
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {account.category && (
                            <Badge variant="outline">{account.category.name}</Badge>
                          )}
                          <Badge variant="secondary">{account.images?.length || 0} images</Badge>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => openAccountDialog(account)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Account</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;{account.name}&quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAccount(account.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Name *</Label>
              <Input
                id="categoryName"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="e.g., PUBG, Fortnite, FIFA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryImage">Image (optional)</Label>
              <Input
                id="categoryImage"
                type="file"
                accept="image/*"
                onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.files?.[0] || null })}
              />
              {editingCategory?.image && !categoryForm.image && (
                <img src={editingCategory.image} alt="Current" className="w-20 h-20 object-cover rounded" />
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCategory} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Account Dialog */}
      <Dialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAccount ? 'Edit Account' : 'Add Account'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Name *</Label>
              <Input
                id="accountName"
                value={accountForm.name}
                onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                placeholder="Account name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountDescription">Description *</Label>
              <Textarea
                id="accountDescription"
                value={accountForm.description}
                onChange={(e) => setAccountForm({ ...accountForm, description: e.target.value })}
                placeholder="Full description of the account"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountShortPreview">Short Preview</Label>
              <Input
                id="accountShortPreview"
                value={accountForm.shortPreview}
                onChange={(e) => setAccountForm({ ...accountForm, shortPreview: e.target.value })}
                placeholder="Brief preview (optional, will use description if empty)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountPrice">Price (TND) *</Label>
                <Input
                  id="accountPrice"
                  type="number"
                  step="0.01"
                  value={accountForm.price}
                  onChange={(e) => setAccountForm({ ...accountForm, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountCategory">Category *</Label>
                <Select
                  value={accountForm.categoryId}
                  onValueChange={(v) => setAccountForm({ ...accountForm, categoryId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountImages">Images * (multiple allowed)</Label>
              <Input
                id="accountImages"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setAccountForm({ 
                  ...accountForm, 
                  images: Array.from(e.target.files || []) 
                })}
              />
              {editingAccount?.images && editingAccount.images.length > 0 && accountForm.images.length === 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {editingAccount.images.map((img, idx) => (
                    <img key={img.id} src={img.url} alt={`Image ${idx + 1}`} className="w-16 h-16 object-cover rounded" />
                  ))}
                  <p className="text-xs text-muted-foreground w-full">Upload new images to replace existing ones</p>
                </div>
              )}
              {accountForm.images.length > 0 && (
                <p className="text-sm text-muted-foreground">{accountForm.images.length} image(s) selected</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="exchangeable"
                checked={accountForm.exchangeable}
                onCheckedChange={(checked) => setAccountForm({ ...accountForm, exchangeable: checked })}
              />
              <Label htmlFor="exchangeable">Available for Exchange</Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAccountDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAccount} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Main App
export default function App() {
  const { currentPage, setSelectedAccountId, setCategories, setAccounts } = useStore()

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, accRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/accounts')
        ])
        const catData = await catRes.json()
        const accData = await accRes.json()
        setCategories(catData.categories || [])
        setAccounts(accData.accounts || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [setCategories, setAccounts])

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      setSelectedAccountId(null)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [setSelectedAccountId])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {currentPage === 'home' && <StorePage />}
        {currentPage === 'account' && <AccountDetailsPage />}
        {currentPage === 'admin-login' && <AdminLoginPage />}
        {currentPage === 'admin' && <AdminPanel />}
      </main>
      <Footer />
    </div>
  )
}

