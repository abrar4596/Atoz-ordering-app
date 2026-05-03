'use client'

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import CartItems from '../Cart/CartItems'
import AuthModal from '../../Auth/AuthModal'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const navIconClass =
  'size-6 shrink-0 text-gray-400 transition-all duration-200 ease-out group-hover:scale-110 group-hover:text-indigo-600 group-hover:-translate-y-0.5 group-hover:drop-shadow-sm'

function NavIconTooltip({ children, label, className = '' }) {
  return (
    <div className={`group relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-[60] mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-200 ease-out delay-75 invisible group-hover:visible group-hover:opacity-100"
      >
        {label}
      </span>
    </div>
  )
}

const navigation = {
  categories: [
    {
      id: 'Medicines',
      name: 'Medicines',
      featured: [],
      sections: [
        {
          id: 'supplements',
          name: 'Supplements',
          items: [
            { name: 'Protein', href: '#' },
            { name: 'Mass Gainer', href: '#' },
            { name: 'Creatine', href: '#' },
            { name: 'Omega-3', href: '#' },
            { name: 'Browse All', href: '#' },
          ],
        },
        {
          id: 'medicines',
          name: 'Medicines',
          items: [
            { name: 'Ayurvedic', href: '#' },
            { name: 'Homeopathy', href: '#' },
            { name: 'Health Care', href: '#' },
            { name: 'Personal Care', href: '#' },
          ],
        },
        {
          id: 'brands',
          name: 'Brands',
          items: [
            { name: 'Optimum Nutrition', href: '#' },
            { name: 'MuscleBlaze', href: '#' },
            { name: 'Himalaya', href: '#' },
            { name: 'GNC', href: '#' },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: 'Stores', href: '#' },
  ],
}

export default function Example() {
  const [open, setOpen] = useState(false)
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalIsLogin, setAuthModalIsLogin] = useState(true)
  const lastScrollY = useRef(0)
  const { itemCount, isCartOpen, toggleCart, closeCart } = useCart()
  const { user, logout } = useAuth()
  const location = useLocation()

  const cartCountLabel = useMemo(() => String(itemCount || 0), [itemCount])

  const isActive = (path) => location.pathname === path

  const openAuthModal = (isLogin = true) => {
    setAuthModalIsLogin(isLogin)
    setIsAuthModalOpen(true)
    setOpen(false) // Close mobile menu if open
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrolledDown = currentScrollY > lastScrollY.current
      const nearTop = currentScrollY < 80

      if (nearTop || !scrolledDown || open || isCartOpen) {
        setIsNavVisible(true)
      } else {
        setIsNavVisible(false)
      }

      lastScrollY.current = currentScrollY
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [open, isCartOpen])

  return (
    <div className="bg-white z-50">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <div className="flex px-4 pb-2 pt-5">
              <NavIconTooltip label="Close">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className={navIconClass} />
                </button>
              </NavIconTooltip>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel key={category.name} className="space-y-10 px-4 pb-8 pt-10">
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                          />
                          <a href={item.href} className="mt-6 block font-medium text-gray-900">
                            <span aria-hidden="true" className="absolute inset-0 z-10" />
                            {item.name}
                          </a>
                          <p aria-hidden="true" className="mt-1">
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
                          {section.name}
                        </p>
                        <ul
                          role="list"
                          aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                          className="mt-6 flex flex-col space-y-6"
                        >
                          {section.items.map((item) => (
                            <li key={item.name} className="flow-root">
                              <a href={item.href} className="-m-2 block p-2 text-gray-500">
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <Link
                    to="/products"
                    onClick={() => setOpen(false)}
                    className={`-m-2 block p-2 font-medium transition-colors ${
                      isActive('/products') ? 'text-indigo-600' : 'text-gray-900'
                    }`}
                  >
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {user ? (
                <div className="flex flex-col space-y-2">
                  <span className="text-sm font-medium text-gray-700">
                    Hi, {user.firstName}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-indigo-600 text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <div className="flow-root">
                    <button
                      onClick={() => openAuthModal(true)}
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Sign in
                    </button>
                  </div>
                  <div className="flow-root">
                    <button
                      onClick={() => openAuthModal(false)}
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Create account
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
                  className="block h-auto w-5 shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">CAD</span>
                <span className="sr-only">, change currency</span>
              </a>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header
        className={`fixed inset-x-0 top-0 z-50 bg-white/95 shadow-md backdrop-blur transition-transform duration-300 ease-in-out supports-[backdrop-filter]:bg-white/80 ${
          isNavVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >

        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>

        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200"> 
            <div className="flex h-16 items-center">
              <NavIconTooltip label="Menu" className="lg:hidden">
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="relative rounded-md bg-white p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-50"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon aria-hidden="true" className={navIconClass} />
                </button>
              </NavIconTooltip>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt=""
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </Link>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-[open]:text-indigo-600">
                          {category.name}
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-[open]:bg-indigo-600"
                          />
                        </PopoverButton>
                      </div>
                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                      >
                        {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                        <div aria-hidden="true" className="absolute inset-0 top-1/2 bg-white shadow" />
                        <div className="relative bg-white">
                          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                              <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                {category.featured.map((item) => (
                                  <div key={item.name} className="group relative text-base sm:text-sm">
                                    <img
                                      alt={item.imageAlt}
                                      src={item.imageSrc}
                                      className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                                    />
                                    <Link to="/products" className="mt-6 block font-medium text-gray-900">
                                      <span aria-hidden="true" className="absolute inset-0 z-10" />
                                      {item.name}
                                    </Link>
                                    <p aria-hidden="true" className="mt-1">
                                      Shop now
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                {category.sections.map((section) => (
                                  <div key={section.name}>
                                    <p id={`${section.name}-heading`} className="font-medium text-gray-900">
                                      {section.name}
                                    </p>
                                    <ul
                                      role="list"
                                      aria-labelledby={`${section.name}-heading`}
                                      className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                    >
                                      {section.items.map((item) => (
                                        <li key={item.name} className="flex">
                                          <Link to="/products" className="hover:text-gray-800">
                                            {item.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}
                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      to="/products"
                      className={`flex items-center text-sm font-medium transition-colors ${
                        isActive('/products') ? 'text-indigo-600' : 'text-gray-700 hover:text-gray-800'
                      }`}
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </PopoverGroup>

                <div className="ml-auto flex items-center">
                  <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    {user ? (
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700">
                          Hi, {user.firstName}
                        </span>
                        <button
                          onClick={logout}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => openAuthModal(true)}
                          className="text-sm font-medium text-gray-700 hover:text-gray-800"
                        >
                          Sign in
                        </button>
                        <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                        <button
                          onClick={() => openAuthModal(false)}
                          className="text-sm font-medium text-gray-700 hover:text-gray-800"
                        >
                          Create account
                        </button>
                      </>
                    )}
                  </div>

                <div className="hidden lg:ml-8 lg:flex">
                  <NavIconTooltip label="Currency">
                    <a
                      href="#"
                      className="flex items-center rounded-md px-1 py-1 text-gray-700 transition-all duration-200 ease-out hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <img
                        alt=""
                        src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
                        className="block h-auto w-5 shrink-0 transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5"
                      />
                      <span className="ml-3 block text-sm font-medium transition-all duration-200 group-hover:font-semibold">
                        CAD
                      </span>
                      <span className="sr-only">, change currency</span>
                    </a>
                  </NavIconTooltip>
                </div>

                {/* Search */}
                <div className="flex lg:ml-6">
                  <NavIconTooltip label="Search">
                    <a
                      href="#"
                      className="block rounded-md p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-50"
                    >
                      <span className="sr-only">Search</span>
                      <MagnifyingGlassIcon aria-hidden="true" className={navIconClass} />
                    </a>
                  </NavIconTooltip>
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <NavIconTooltip label="Cart">
                    <button
                      type="button"
                      onClick={toggleCart}
                      className="-m-2 flex items-center rounded-md p-2 transition-colors duration-200 hover:bg-gray-50"
                      aria-label="Toggle cart"
                    >
                      <ShoppingBagIcon aria-hidden="true" className={navIconClass} />
                      <span className="ml-2 text-sm font-medium text-gray-700 transition-all duration-200 group-hover:font-semibold group-hover:text-indigo-600">
                        {cartCountLabel}
                      </span>
                      <span className="sr-only">items in cart, view bag</span>
                    </button>
                  </NavIconTooltip>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div aria-hidden="true" className="h-[6.5rem]" />

      {/* Cart drawer */}
      <CartItems isOpen={isCartOpen} onClose={closeCart} />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialIsLogin={authModalIsLogin}
      />
    </div>
  )
}
