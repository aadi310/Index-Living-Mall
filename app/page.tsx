"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronRight,
  Bell,
  Download,
  ExternalLink,
  FileText,
  History,
  Instagram,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Star,
  User2,
  ThumbsUp,
  Share2,
  Facebook,
  Sparkles,
  MapPin,
  ShoppingBagIcon,
  Utensils,
  Gift,
  Receipt as ReceiptIcon,
} from "lucide-react"

interface Receipt {
  id: string
  date: string
  time: string
  associate: string
  items: Array<{
    id: number
    name: string
    description: string
    price: number
    quantity: number
    category?: string
    taxApplicable?: boolean
    baseAmount?: number
    tax?: number
    itemCode?: string
    size?: string
    color?: string
    material?: string
  }>
  subtotal: number
  tax: number
  total: number
}

// Thai Baht formatter
const fmt = (n: number) =>
  `฿${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showTerms, setShowTerms] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [expandedProducts, setExpandedProducts] = useState<number[]>([])
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: string[] }>({})
  const [currentReceiptId, setCurrentReceiptId] = useState("current")
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [showReferModal, setShowReferModal] = useState(false)
  const [showStoreLocation, setShowStoreLocation] = useState(false)
  const receiptContainerRef = useRef<HTMLDivElement>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [couponToast, setCouponToast] = useState(false)
  const [itemFeedback, setItemFeedback] = useState({})
  const [expandedItemFeedback, setExpandedItemFeedback] = useState([])
  const [submittedItemFeedback, setSubmittedItemFeedback] = useState({})
  const [feedback, setFeedback] = useState({
    service: 0,
    quality: 0,
    style: 0,
    pricing: 0,
    store: 0,
    comments: "",
  })
  const [profile, setProfile] = useState({
    mobile: "",
    name: "",
    email: "",
    gender: "",
  })
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")

  // Loyalty (JOY Card) program state
  const [loyaltyForm, setLoyaltyForm] = useState({
    name: "",
    mobile: "",
    email: "",
    branch: "",
  })
  const [loyaltySubmitted, setLoyaltySubmitted] = useState(false)

  const handleLoyaltyChange = (field: string, value: string) => {
    setLoyaltyForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleLoyaltySubmit = () => {
    if (!loyaltyForm.name || !loyaltyForm.mobile) {
      alert("Please fill in your name and mobile number.")
      return
    }
    setLoyaltySubmitted(true)
    setTimeout(() => setLoyaltySubmitted(false), 5000)
  }

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code)
    setCouponToast(true)
    setTimeout(() => {
      setCouponToast(false)
    }, 2000)
  }

  const toggleItemFeedback = (id) => {
    setExpandedItemFeedback((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const setItemRating = (itemId, rating) => {
    setItemFeedback((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        rating,
      },
    }))
  }

  const toggleItemTag = (itemId, tag) => {
    setItemFeedback((prev) => {
      const currentTags = prev[itemId]?.tags || []
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag]
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          tags: newTags,
        },
      }
    })
  }

  const submitItemFeedback = (itemId) => {
    const current = itemFeedback[itemId]
    if (!current?.rating) {
      alert("Please select a rating before submitting.")
      return
    }
    setSubmittedItemFeedback((prev) => ({
      ...prev,
      [itemId]: current,
    }))
    setExpandedItemFeedback((prev) => prev.filter((id) => id !== itemId))
  }

  const customerName = "Nichakarn"

  // Carousel refs and APIs
  const [promoApi, setPromoApi] = useState<CarouselApi>()
  const feedbackButtonRef = useRef<HTMLButtonElement>(null)
  const historyButtonRef = useRef<HTMLButtonElement>(null)
  const referButtonRef = useRef<HTMLButtonElement>(null)

  // Auto-play effect for promo carousel
  useEffect(() => {
    if (!promoApi) return
    const interval = setInterval(() => {
      promoApi.scrollNext()
    }, 4000)
    return () => clearInterval(interval)
  }, [promoApi])

  useEffect(() => {
    setItemFeedback({})
    setExpandedItemFeedback([])
    setSubmittedItemFeedback({})
  }, [currentReceiptId])

  // Simple auto-height for WordPress iframe
  useEffect(() => {
    const postHeight = () => {
      const marker = document.getElementById("height-marker")
      if (marker && window.parent) {
        const rect = marker.getBoundingClientRect()
        const newHeight = Math.ceil(rect.top + rect.height + window.scrollY)
        window.parent.postMessage({ frameHeight: newHeight }, "*")
      }
    }

    postHeight()

    const ro = new ResizeObserver(postHeight)
    ro.observe(document.body)

    window.addEventListener("resize", postHeight)

    return () => {
      ro.disconnect()
      window.removeEventListener("resize", postHeight)
    }
  }, [])

  // Update current slide when carousel changes
  useEffect(() => {
    if (!promoApi) return
    promoApi.on("select", () => {
      setCurrentSlide(promoApi.selectedScrollSnap())
    })
  }, [promoApi])

  const receipts = {
    current: {
      id: "Y3BKK78912XQ",
      date: "18-07-2026",
      time: "16:42:05",
      associate: "Somchai Boonmee",
      branch: "Y3 – Bangna",
      items: [
        {
          id: 0,
          name: "Melton Bedroom Set",
          size: "6ft (King) + 5-Door Wardrobe w/ Mirror",
          description: "White finish bedroom set with bed and mirrored 5-door wardrobe",
          price: 18990,
          quantity: 1,
          category: "Bedroom",
          taxApplicable: true,
          baseAmount: 17747.66,
          tax: 1242.34,
          itemCode: "BED001",
        },
        {
          id: 1,
          name: "Melbourne Bedroom Set",
          size: "6ft (King) + 5-Door Wardrobe + Dressing Table",
          description: "Sandstone/Lebana Oak finish bedroom set",
          price: 22990,
          quantity: 1,
          category: "Bedroom",
          taxApplicable: true,
          baseAmount: 21485.98,
          tax: 1504.02,
          itemCode: "BED003",
        },
        {
          id: 2,
          name: "Dominek Fabric L-Shape Sofa Bed",
          size: "L-Shape / 3-Seater Sofa Bed",
          description: "L-shape fabric sofa bed",
          price: 13890,
          quantity: 1,
          category: "Living Room",
          taxApplicable: true,
          baseAmount: 12981.31,
          tax: 908.69,
          itemCode: "SOF002",
        },
      ],
      subtotal: 52214.95,
      tax: 3655.05,
      total: 55870.0,
    },

    hist1: {
      id: "Y3BKK65432LP",
      date: "02-06-2026",
      time: "11:15:40",
      associate: "Ananya Suwannarat",
      branch: "Y3 – Ekkamai",
      items: [
        {
          id: 0,
          name: "Balance Ergonomic Chair",
          size: "Standard / Black Mesh",
          description: "Ergonomic office chair",
          price: 3690,
          quantity: 1,
          category: "Home Office",
          taxApplicable: true,
          baseAmount: 3448.6,
          tax: 241.4,
          itemCode: "OFC001",
        },
        {
          id: 1,
          name: "Diano Table Vase 11\"",
          size: "11 inch",
          description: "White and silver table vase",
          price: 795,
          quantity: 2,
          category: "Home Decor",
          taxApplicable: true,
          baseAmount: 1485.98,
          tax: 104.02,
          itemCode: "DEC001",
        },
      ],
      subtotal: 4934.58,
      tax: 345.42,
      total: 5280.0,
    },

    hist2: {
      id: "Y3BKK54219QW",
      date: "10-04-2026",
      time: "17:30:12",
      associate: "Kittipong Chaisri",
      branch: "Y3 – Rama 2 (Flagship)",
      items: [
        {
          id: 0,
          name: "Ricotta Dining Table",
          size: "150cm",
          description: "Brown/black dining table",
          price: 8990,
          quantity: 1,
          category: "Dining & Kitchen",
          taxApplicable: true,
          baseAmount: 8401.87,
          tax: 588.13,
          itemCode: "DIN006",
        },
        {
          id: 1,
          name: "Chicca Table Vase 10\"",
          size: "10 inch",
          description: "White and black table vase",
          price: 795,
          quantity: 1,
          category: "Home Decor",
          taxApplicable: true,
          baseAmount: 742.99,
          tax: 52.01,
          itemCode: "DEC006",
        },
      ],
      subtotal: 9144.86,
      tax: 640.14,
      total: 9785.0,
    },
  }

  const currentReceipt = receipts[currentReceiptId]

  const totalSlides = 2

  const transactionHistory = [
    {
      id: "current",
      date: "18-07-2026",
      branch: "Y3",
      amount: currentReceiptId === "current" ? receipts.current.subtotal + receipts.current.tax : 55870.0,
    },
    { id: "hist1", date: "02-06-2026", branch: "Y3", amount: 5280.0 },
    { id: "hist2", date: "10-04-2026", branch: "Y3", amount: 9785.0 },
  ]

  const toggleProductExpansion = (productId: number) => {
    setExpandedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleProfileUpdate = () => {
    setProfileUpdateSuccess(true)
    setTimeout(() => setProfileUpdateSuccess(false), 3000)
  }

  const getModalPositionRelativeToContainer = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    if (!buttonRef.current || !receiptContainerRef.current) {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
    }

    const button = buttonRef.current
    const container = receiptContainerRef.current

    const buttonRect = button.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    const relativeTop = buttonRect.top - containerRect.top
    const relativeLeft = buttonRect.left - containerRect.left

    const modalWidth = Math.min(400, containerRect.width - 32)
    const modalHeight = 400

    let top = Math.max(16, relativeTop - modalHeight - 8)

    if (top < 16) {
      top = relativeTop + buttonRect.height + 8
    }

    if (top + modalHeight > containerRect.height) {
      top = Math.max(16, (containerRect.height - modalHeight) / 2)
    }

    let left = relativeLeft + buttonRect.width / 2 - modalWidth / 2

    left = Math.max(16, Math.min(left, containerRect.width - modalWidth - 16))

    return {
      position: "absolute" as const,
      top: `${top}px`,
      left: `${left}px`,
      width: `${modalWidth}px`,
      maxHeight: "85vh",
    }
  }

  const handleFeedbackModalOpen = () => {
    setShowFeedbackModal(true)
  }

  const handleTransactionHistoryOpen = () => {
    setShowTransactionHistory(true)
  }

  const handleReferModalOpen = () => {
    setShowReferModal(true)
  }

  const handleFeedbackSubmit = () => {
    setFeedbackSubmitted(true)
    setShowFeedbackModal(false)
    setTimeout(() => setFeedbackSubmitted(false), 5000)
  }

  const handleShare = () => {
    handleReferModalOpen()
  }

  const handleEmailReceipt = () => {
    window.open(`mailto:?subject=Receipt from Y3&body=Order ID: ${currentReceipt.id}`)
  }

  const handleDownloadReceipt = () => {
    const receiptContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Y3 Digital Receipt</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Poppins',sans-serif;font-size:14px;color:#111;background:#fff;width:800px;margin:0 auto;padding:24px;}
.receipt-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:16px;border-bottom:3px solid #111111;}
.company-info h1{font-size:30px;color:#111111;font-weight:700;margin-bottom:4px;}
.company-info p{font-size:12px;color:#555;line-height:1.4;}
.bill-info{text-align:right;font-size:12px;}
.bill-info div{margin-bottom:4px;}
.bill-id{font-weight:600;color:#111111;}
.customer-section{background:#F3EAF7;padding:14px;border-left:4px solid #652D89;border-radius:0 8px 8px 0;margin-bottom:22px;}
.customer-section h3{font-size:15px;color:#111111;font-weight:600;margin-bottom:2px;}
.customer-section p{font-size:12px;color:#666;}
.items-table{width:100%;border-collapse:collapse;margin-bottom:24px;}
.items-table th{background:#111111;color:#652D89;padding:10px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;}
.items-table td{padding:12px 8px;border-bottom:1px solid #eee;font-size:12px;vertical-align:top;}
.item-name{font-weight:600;margin-bottom:3px;}
.item-desc{font-size:11px;color:#666;}
.item-specs{font-size:10px;color:#111111;margin-top:4px;font-weight:600;}
.totals-section{display:flex;justify-content:space-between;margin-bottom:20px;}
.items-count{font-weight:600;}
.totals-table{text-align:right;min-width:200px;}
.totals-table div{margin-bottom:6px;font-size:13px;}
.net-total{font-size:18px;font-weight:700;color:#111111;border-top:2px solid #652D89;padding-top:6px;margin-top:6px;}
.footer{text-align:center;margin-top:30px;padding-top:20px;border-top:1px dashed #ccc;font-size:12px;color:#555;}
.footer strong{color:#111111;}
.powered{margin-top:10px;font-size:10px;color:#999;font-weight:600;}
@media print{body{-webkit-print-color-adjust:exact;width:100%;padding:0;}}
</style>
</head>
<body>

<div class="receipt-header">
  <div class="company-info">
    <h1>Y3</h1>
    <p>
      <strong>Y3</strong><br>
      Store Address Line 1<br>
      Store Address Line 2<br>
      Bangkok, Thailand
    </p>
  </div>
  <div class="bill-info">
    <div><strong>Order ID:</strong> <span class="bill-id">${currentReceipt.id}</span></div>
    <div><strong>Date:</strong> ${currentReceipt.date} ${currentReceipt.time}</div>
    <div><strong>Store Associate:</strong> ${currentReceipt.associate}</div>
  </div>
</div>

<div class="customer-section">
  <h3>Customer: ${customerName}</h3>
  <p>Thank you for shopping with Y3!</p>
</div>

<table class="items-table">
  <thead>
    <tr>
      <th style="width:50%">Product</th>
      <th style="width:10%">Qty</th>
      <th style="width:15%">Variant</th>
      <th style="width:12%">Price</th>
      <th style="width:13%">Total</th>
    </tr>
  </thead>
  <tbody>
    ${currentReceipt.items.map(item => `
    <tr>
      <td>
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.description}</div>
        <div class="item-specs">${item.category}</div>
      </td>
      <td>${item.quantity}</td>
      <td>${item.size}</td>
      <td>฿${item.price.toLocaleString("en-US")}</td>
      <td><strong>฿${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></td>
    </tr>`).join('')}
  </tbody>
</table>

<div class="totals-section">
  <div class="items-count">Items Ordered: ${currentReceipt.items.length}</div>
  <div class="totals-table">
    <div>Subtotal: <strong>฿${currentReceipt.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></div>
    <div>VAT (7%): <strong>฿${currentReceipt.tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></div>
    <div class="net-total">Total: <strong>฿${currentReceipt.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></div>
  </div>
</div>

<div class="footer">
  <p><strong>Khob Khun! See you again at Y3.</strong></p>
  <p>Shop again at www.y3.com</p>
</div>

</body>
</html>
  `

    const blob = new Blob([receiptContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Y3_Receipt_${currentReceipt.id}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleWhatsApp = () => {
    window.open("https://wa.me/+919620921294", "_blank")
  }

  const handleCall = () => {
    window.open("tel:+919620921294", "_blank")
  }

  const handleEmail = () => {
    window.open("mailto:sagar.p@proenx.com", "_blank")
  }

  const handleSocialLink = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div
        id="receipt-root"
        ref={receiptContainerRef}
        className="w-full max-w-md mx-auto bg-white shadow-lg relative overflow-hidden"
      >
        <div className="flex flex-col w-full gap-3 pb-4 px-3">

          {/* Top Section */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 mt-4 mx-3 overflow-hidden">

            {/* Header */}
            <div className="bg-[#111111] px-5 pt-5 pb-6 text-white">
              <div className="flex items-start justify-between">

                {/* Y3 Logo */}
                <img
                  src="/images/design-mode/Y3-logo.png"
                  alt="Y3"
                  className="h-14 w-auto bg-white rounded-lg p-1.5"
                />

                {/* QR */}
                <div className="bg-white rounded-xl p-2 shadow-sm">
                  <Image
                    src="/images/design-mode/800px-QR_code_for_mobile_English_Wikipedia.svg.png"
                    alt="QR Code"
                    width={52}
                    height={52}
                  />
                </div>
              </div>

              {/* Greeting */}
              <div className="mt-3">
                <div className="text-lg font-semibold">
                  Sawasdee, {customerName}
                </div>
                <div className="text-sm opacity-90">
                  Your Y3 order is confirmed
                </div>
              </div>

              {/* Amount */}
              <div className="mt-4 bg-[#652D89] rounded-xl p-4 flex justify-between items-center">
                <div>
                  <div className="text-xs text-white/70">
                    Amount Paid
                  </div>
                  <div className="text-3xl font-semibold text-white">
                    {fmt(currentReceipt.total)}
                  </div>
                </div>
                <User2 className="h-7 w-7 text-white/60" />
              </div>
            </div>

            {/* Receipt Metadata */}
            <div className="p-4 bg-white">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Order ID:</span>
                  <span className="text-sm font-semibold tracking-wide text-right">{currentReceipt.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Order Time:</span>
                  <span className="text-sm font-semibold text-right">{currentReceipt.date} {currentReceipt.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Details */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 mt-4 mx-3 p-4">

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center text-black">
                <ShoppingBagIcon className="mr-2 h-5 w-5" />
                Your Y3 Order
              </h3>
              <span className="text-xs font-medium border-2 border-[#652D89] text-black px-2 py-1 rounded-full">
                {currentReceipt.items.length} items
              </span>
            </div>

            <div className="space-y-3">
              {currentReceipt.items.map((product) => (
                <div key={product.id} className="bg-[#F3EAF7] rounded-xl p-3 border border-[#D9B8E8]">

                  <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleProductExpansion(product.id)}>
                    <div className="flex items-center flex-1">
                      <ChevronRight className={`h-4 w-4 mr-2 text-black transition-transform duration-200 ${expandedProducts.includes(product.id) ? "rotate-90" : ""}`} />
                      <div>
                        <div className="font-medium text-sm text-gray-900">{product.name}</div>

                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Qty {product.quantity}</div>
                      <div className="font-semibold text-sm text-black">{fmt(product.price * product.quantity)}</div>
                    </div>
                  </div>

                  {expandedProducts.includes(product.id) && (
                    <div className="mt-3 pt-3 border-t border-[#D9B8E8] text-xs text-gray-600 grid grid-cols-2 gap-y-1">
                      <div>Item Code: {product.itemCode}</div>
                      <div>Variant: {product.size}</div>
                      <div>Base: {fmt(product.baseAmount)}</div>
                      <div>VAT: {fmt(product.tax)}</div>
                    </div>
                  )}

                  <div className="mt-3">
                    {submittedItemFeedback[product.id] ? (
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                          ✓ Feedback Submitted
                        </span>

                        <button
                          onClick={() => toggleItemFeedback(product.id)}
                          className="text-xs text-black font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleItemFeedback(product.id)}
                        className="text-xs text-black font-medium"
                      >
                        {expandedItemFeedback.includes(product.id)
                          ? "Hide item feedback"
                          : "Rate this item"}
                      </button>
                    )}
                  </div>

                  {expandedItemFeedback.includes(product.id) && (
                    <div className="mt-3 bg-white border border-gray-200 rounded-xl p-3">
                      <div className="flex justify-center gap-2 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => setItemRating(product.id, star)}>
                            <Star className={`h-5 w-5 ${star <= (itemFeedback[product.id]?.rating || 0) ? "fill-[#652D89] text-[#652D89]" : "text-gray-300"}`} />
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {["Quality", "Delivery", "Assembly", "Value"].map((tag) => {
                          const active = itemFeedback[product.id]?.tags?.includes(tag)
                          return (
                            <button key={tag} onClick={() => toggleItemTag(product.id, tag)}
                              className={`text-[11px] px-2 py-1 rounded-full border ${active ? "bg-black text-white border-black" : "border-gray-200"}`}>
                              {tag}
                            </button>
                          )
                        })}
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => submitItemFeedback(product.id)}
                          className="w-full bg-[#652D89] hover:bg-[#551f75] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                        >
                          Submit Feedback
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-5 pt-4 border-t border-gray-200 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{fmt(currentReceipt.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">VAT (7%)</span><span>{fmt(currentReceipt.tax)}</span></div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                <span>Total Paid</span><span className="text-black">{fmt(currentReceipt.total)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="mt-5">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-[#FFFFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium">Card Payment</div>
                    <div className="text-xs text-gray-500">**** **** **** 4532</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-black">{fmt(currentReceipt.total)}</div>
              </div>
            </div>
          </div>

          {/* Y3 Promo Banners — 1920x775 aspect ratio */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden mx-3 mt-4 relative font-poppins">

            <Carousel className="w-full" setApi={setPromoApi} opts={{ loop: true }}>
              <CarouselContent>

                {/* Banner 1 — Flash Deal */}
                <CarouselItem>
                  <div className="relative w-full aspect-[1920/775] bg-[#F3EAF7]">
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="absolute inset-0">
                      <Image src="/images/design-mode/index-banner-1.png" alt="Y3 Flash Deal" fill className="object-cover" priority />
                    </a>
                  </div>
                </CarouselItem>

                {/* Banner 2 — Work Space */}
                <CarouselItem>
                  <div className="relative w-full aspect-[1920/775] bg-[#F3EAF7]">
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="absolute inset-0">
                      <Image src="/images/design-mode/index-banner-2.png" alt="Y3 Promotion" fill className="object-cover" />
                    </a>
                  </div>
                </CarouselItem>

              </CarouselContent>

              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                {[0, 1].map((index) => (
                  <button key={index} onClick={() => promoApi?.scrollTo(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? "w-5 bg-[#652D89]" : "w-1.5 bg-white/70"}`} />
                ))}
              </div>
            </Carousel>
          </div>

{/* JOY Card Loyalty Program */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">
            {loyaltySubmitted ? (
              <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Welcome to JOY Card!</div>
                <div className="text-xs text-gray-500">We'll send your membership confirmation to your email shortly.</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center mb-1">
                  <div className="bg-black p-2 rounded-lg mr-3">
                    <Gift className="h-4 w-4 text-[#FFFFFF]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Join JOY Card</h3>
                    <p className="text-[11px] text-gray-500">Earn points on every purchase & unlock member-only deals</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Nichakarn Srisuk"
                      value={loyaltyForm.name}
                      onChange={(e) => handleLoyaltyChange("name", e.target.value)}
                      className="w-full p-2.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#652D89] focus:border-[#652D89] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 08X-XXX-XXXX"
                      value={loyaltyForm.mobile}
                      onChange={(e) => handleLoyaltyChange("mobile", e.target.value)}
                      className="w-full p-2.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#652D89] focus:border-[#652D89] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. name@email.com"
                      value={loyaltyForm.email}
                      onChange={(e) => handleLoyaltyChange("email", e.target.value)}
                      className="w-full p-2.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#652D89] focus:border-[#652D89] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Preferred Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangna, Ekkamai, Rama 2..."
                      value={loyaltyForm.branch}
                      onChange={(e) => handleLoyaltyChange("branch", e.target.value)}
                      className="w-full p-2.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#652D89] focus:border-[#652D89] outline-none"
                    />
                  </div>
                </div>

                <button
                  className="w-full bg-[#652D89] hover:bg-[#551f75] text-white h-10 text-xs font-semibold rounded-xl transition active:scale-[0.98]"
                  onClick={handleLoyaltySubmit}
                >
                  Join JOY Card
                </button>

                <p className="text-[10px] text-center text-gray-400">Free to join. Collect points automatically with every purchase.</p>
              </div>
            )}
          </div>


          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">
            {feedbackSubmitted ? (
              <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Thanks for your feedback!</div>
                <div className="text-xs text-gray-500">Your input helps us improve every Y3 experience.</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-black p-2 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 text-[#FFFFFF]" fill="currentColor">
                        <path d="M11.5 2C7 2 3.5 5.3 3.5 9.5c0 2.4 1.2 4.4 3.1 5.7L6 22l5.1-2.6c.5.1 1 .1 1.5.1 4.5 0 8-3.3 8-7.5S16 2 11.5 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Rate Your Y3 Experience</h3>
                  </div>
                </div>

                <div className="flex justify-center gap-3 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        setRating(star)
                        setSelectedTags([])
                      }}
                      className="transition-transform active:scale-90"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= rating
                            ? "fill-[#652D89] text-[#652D89]"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {rating > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Tell us more about your order</div>
                    <div className="flex flex-wrap gap-2">
                      {(rating >= 4
                        ? ["Great quality", "Sturdy build", "Well packaged", "Good value", "Fast delivery", "Order was accurate"]
                        : ["Poor quality", "Slow delivery", "Wrong item", "Assembly issues", "Packaging issue", "Not good value"]
                      ).map((item) => (
                        <button key={item}
                          onClick={() => setSelectedTags((prev) => prev.includes(item) ? prev.filter((tag) => tag !== item) : [...prev, item])}
                          className={`text-[11px] px-3 py-1.5 rounded-full border transition ${selectedTags.includes(item) ? "bg-black text-white border-black" : "border-gray-200 bg-gray-50"}`}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Additional Feedback (Optional)</label>
                  <textarea rows={3} placeholder="Tell us about your Y3 order"
                    className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#652D89] focus:border-[#652D89] outline-none resize-none"
                    value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} />
                </div>

                <button className="w-full bg-[#652D89] hover:bg-[#551f75] text-white h-10 text-xs font-semibold rounded-xl transition active:scale-[0.98]"
                  onClick={handleFeedbackSubmit} disabled={!rating}>
                  Submit Feedback
                </button>

                <p className="text-[10px] text-center text-gray-400">Your feedback helps Y3 improve every order.</p>
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">
            <div className="grid grid-cols-3 gap-3">
              <button ref={historyButtonRef} onClick={handleTransactionHistoryOpen}
                className="flex flex-col items-center justify-center bg-[#F3EAF7] border border-[#D9B8E8] rounded-xl py-3 active:scale-[0.98]">
                <History className="h-5 w-5 text-black mb-1" />
                <span className="text-[11px] font-medium text-gray-700">Orders</span>
              </button>

              <button onClick={handleEmailReceipt}
                className="flex flex-col items-center justify-center bg-[#F3EAF7] border border-[#D9B8E8] rounded-xl py-3 active:scale-[0.98]">
                <Mail className="h-5 w-5 text-black mb-1" />
                <span className="text-[11px] font-medium text-gray-700">Email</span>
              </button>

              <button onClick={handleDownloadReceipt}
                className="flex flex-col items-center justify-center bg-[#F3EAF7] border border-[#D9B8E8] rounded-xl py-3 active:scale-[0.98]">
                <Download className="h-5 w-5 text-black mb-1" />
                <span className="text-[11px] font-medium text-gray-700">Download</span>
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">
            <div className="flex items-center mb-3">
              <div className="bg-black p-2 rounded-lg mr-3">
                <Send className="h-4 w-4 text-[#FFFFFF]" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Y3 Support</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button onClick={handleWhatsApp} className="flex flex-col items-center justify-center bg-[#F3EAF7] border border-[#D9B8E8] rounded-xl py-3 active:scale-[0.98]">
                <MessageSquare className="h-5 w-5 text-black mb-1" />
                <span className="text-[11px] font-medium text-gray-700">Chat</span>
              </button>
              <button onClick={handleCall} className="flex flex-col items-center justify-center bg-[#F3EAF7] border border-[#D9B8E8] rounded-xl py-3 active:scale-[0.98]">
                <Phone className="h-5 w-5 text-black mb-1" />
                <span className="text-[11px] font-medium text-gray-700">Call</span>
              </button>
              <button onClick={handleEmail} className="flex flex-col items-center justify-center bg-[#F3EAF7] border border-[#D9B8E8] rounded-xl py-3 active:scale-[0.98]">
                <Mail className="h-5 w-5 text-black mb-1" />
                <span className="text-[11px] font-medium text-gray-700">Email</span>
              </button>
            </div>
          </div>

          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">

            <div className="flex items-center mb-4">
              <div className="bg-black p-2 rounded-lg mr-3">
                <Share2 className="h-4 w-4 text-[#FFFFFF]" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Stay Connected</h3>
            </div>

            <div className="flex justify-center space-x-6 mb-4">
              <button onClick={() => handleSocialLink("https://www.instagram.com")} className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center mb-1">
                  <Instagram className="h-4 w-4 text-white" />
                </div>
                <span className="text-[11px] font-medium text-gray-700">Instagram</span>
              </button>

              <button onClick={() => handleSocialLink("https://www.facebook.com")} className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center mb-1">
                  <Facebook className="h-4 w-4 text-white" />
                </div>
                <span className="text-[11px] font-medium text-gray-700">Facebook</span>
              </button>

              <button onClick={() => handleSocialLink("https://www.y3.com")} className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center mb-1">
                  <ExternalLink className="h-4 w-4 text-[#652D89]" />
                </div>
                <span className="text-[11px] font-medium text-gray-700">Website</span>
              </button>
            </div>

            {/* Store Location */}
            <div className="text-xs text-gray-600 text-center mb-3 bg-gray-50 p-3 rounded-xl">
              <button onClick={() => setShowStoreLocation(!showStoreLocation)}
                className="w-full flex items-center justify-center mb-2 hover:text-black transition-colors">
                <MapPin className="h-3 w-3 mr-1 text-black" />
                <span className="font-semibold text-black">
                  Y3 – {currentReceipt.branch.replace("Y3 – ", "")} {showStoreLocation ? "▲" : "▼"}
                </span>
              </button>

              {showStoreLocation && (
                <div className="space-y-0.5">
                  <p className="font-semibold text-gray-900">Y3</p>
                  <p>Store Address Line 1</p>
                  <p>Store Address Line 2</p>
                  <p>Bangkok, Thailand</p>
                  <p className="mt-2 text-[10px]">Tax ID: 010753XXXXXXX</p>
                  <p className="mt-1 text-black font-semibold">Store Manager: {currentReceipt.associate}</p>
                </div>
              )}
            </div>

            {/* Terms */}
            <button className="w-full text-xs text-gray-500 hover:text-black h-6 font-medium" onClick={() => setShowTerms(!showTerms)}>
              Terms & Conditions {showTerms ? "▲" : "▼"}
            </button>

            {showTerms && (
              <div className="text-[11px] text-gray-500 mt-2 space-y-1 px-2 font-medium">
                <p>• Offers and coupons are subject to availability and location.</p>
                <p>• Prices include applicable VAT.</p>
                <p>• JOY Card points are non-transferable and valid for 12 months from the date of purchase.</p>
                <p>• For support visit www.y3.com.</p>
              </div>
            )}
          </div>
          <div id="height-marker" style={{ height: "1px" }} />
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div
            style={getModalPositionRelativeToContainer(feedbackButtonRef)}
            className="bg-white rounded-lg w-full overflow-hidden shadow-xl z-[9999] max-w-sm"
          >
            <div className="flex justify-between items-center p-4 border-b bg-black text-white">
              <h3 className="text-lg font-semibold">How was your shopping experience?</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white"
                onClick={() => setShowFeedbackModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>

            <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
              {[
                { key: "service", label: "Service Quality" },
                { key: "quality", label: "Product Quality" },
                { key: "style", label: "Furniture Style/Design" },
                { key: "pricing", label: "Value for Money" },
                { key: "store", label: "Store Ambiance" },
              ].map((category) => (
                <div key={category.key} className="flex items-center justify-between">
                  <span className="text-sm">{category.label}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          setFeedback((prev) => ({
                            ...prev,
                            [category.key as keyof typeof feedback]: star,
                          }))
                        }
                      >
                        <Star
                          className={`h-5 w-5 ${
                            feedback[category.key as keyof typeof feedback] >= star
                              ? "text-[#652D89] fill-[#652D89]"
                              : "text-gray-300"
                          }`}
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              ))}

              <Textarea
                placeholder="Please share your feedback about your purchase (optional)"
                className="mt-2"
                value={feedback.comments}
                onChange={(e) => setFeedback((prev) => ({ ...prev, comments: e.target.value }))}
              />
            </div>

            <div className="p-4 border-t">
              <Button className="w-full bg-black hover:bg-gray-800 text-white" onClick={handleFeedbackSubmit}>
                Submit Feedback
              </Button>
            </div>
          </div>
        )}

        {/* Transaction History Modal */}
        {showTransactionHistory && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">

            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowTransactionHistory(false)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl border border-gray-200 font-poppins overflow-hidden">

              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-100">

                <div className="flex items-center">
                  <div className="bg-black p-2 rounded-lg mr-3">
                    <History className="h-4 w-4 text-[#652D89]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Order History
                  </h3>
                </div>

                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  onClick={() => setShowTransactionHistory(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-gray-500"
                  >
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>

              </div>

              {/* Transaction List */}
              <div className="max-h-80 overflow-y-auto p-4 space-y-3">

                {transactionHistory.map((transaction) => (

                  <button
                    key={transaction.id}
                    onClick={() => {
                      setCurrentReceiptId(transaction.id)
                      setShowTransactionHistory(false)
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    className="w-full flex items-center p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-black transition"
                  >

                    <div className="bg-white border border-gray-200 p-2 rounded-lg mr-3">
                      <FileText className="h-4 w-4 text-black" />
                    </div>

                    <div className="flex-grow text-left">
                      <div className="text-sm font-semibold text-gray-900">
                        Y3
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {transaction.date}
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-black">
                      {fmt(transaction.amount)}
                    </div>

                  </button>

                ))}

              </div>

            </div>

          </div>
        )}

        {/* Refer & Earn Modal */}
        {showReferModal && (
          <div
            style={getModalPositionRelativeToContainer(referButtonRef)}
            className="bg-white rounded-lg w-full overflow-hidden shadow-xl z-[9999] max-w-sm"
          >
            <div className="flex justify-between items-center p-4 border-b bg-black text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Refer & Earn
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-gray-800"
                onClick={() => setShowReferModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#F3EAF7] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="h-8 w-8 text-black" />
                </div>
                <h4 className="text-lg font-semibold text-black mb-2">Share & Earn ฿500!</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Refer friends to Y3 and both of you get ฿500 off your next purchase!
                </p>
              </div>
              <div className="bg-[#F3EAF7] p-3 rounded-lg border border-[#D9B8E8]">
                <div className="text-xs font-medium text-black mb-1">Your Referral Code</div>
                <div className="text-lg font-bold text-black text-center">Y3{customerName.toUpperCase()}500</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-black text-black hover:bg-gray-50 bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Try Y3! Use code Y3${customerName.toUpperCase()}500 for ฿500 off!`,
                    )
                    setShowReferModal(false)
                  }}
                >
                  Copy Code
                </Button>
                <Button
                  className="bg-[#652D89] hover:bg-[#551f75] text-white font-semibold"
                  onClick={() => {
                    window.open(
                      `https://wa.me/?text=Try Y3! Use my code Y3${customerName.toUpperCase()}500 for ฿500 off your next purchase!`,
                    )
                    setShowReferModal(false)
                  }}
                >
                  Share Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
