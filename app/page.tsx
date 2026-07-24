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

  // Optional: collapse the feedback card
  setExpandedItemFeedback((prev) =>
    prev.filter((id) => id !== itemId)
  )
}

  const customerName = "Sagar"

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

    // Run on load
    postHeight()

    // Observe changes to the DOM
    const ro = new ResizeObserver(postHeight)
    ro.observe(document.body)

    // Re-run on resize
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
    id: "BKNVLDEL7891XQ",
    date: "05-03-2026",
    time: "19:22:18",
    associate: "Rahul Kumar",
    branch: "Shakurpur, New Delhi",
    items: [
      {
        id: 0,
        name: "Kaju Katli",
        size: "250g",
        description: "Premium cashew mithai, diamond-cut and finished with edible silver warq",
        price: 399,
        quantity: 1,
        category: "Sweets",
        taxApplicable: true,
        baseAmount: 380,
        tax: 19,
        itemCode: "BKV101",
        type: "Veg",
      },
      {
        id: 1,
        name: "Soan Papdi",
        size: "400g",
        description: "Flaky, melt-in-mouth gram flour and ghee sweet with cardamom",
        price: 150,
        quantity: 1,
        category: "Sweets",
        taxApplicable: true,
        baseAmount: 143,
        tax: 7,
        itemCode: "BKV205",
        type: "Veg",
      },
      {
        id: 2,
        name: "Bikaneri Bhujia",
        size: "200g",
        description: "The original Bikaner-style crispy gram flour namkeen",
        price: 90,
        quantity: 2,
        category: "Namkeen",
        taxApplicable: true,
        baseAmount: 171,
        tax: 9,
        itemCode: "BKV310",
        type: "Veg",
      },
    ],
    subtotal: 729,
    tax: 36,
    total: 765,
  },

  hist1: {
    id: "BKNVLDEL6719YT",
    date: "20-01-2026",
    time: "14:22:18",
    associate: "Anita Sharma",
    branch: "Rajouri Garden, New Delhi",
    items: [
      {
        id: 0,
        name: "Motichoor Laddu",
        size: "400g",
        description: "Fine besan pearls bound in sugar syrup with cardamom and dry fruits",
        price: 220,
        quantity: 1,
        category: "Sweets",
        taxApplicable: true,
        baseAmount: 210,
        tax: 10,
        itemCode: "BKV118",
        type: "Veg",
      },
      {
        id: 1,
        name: "Rasgulla",
        size: "1 Kg Tin",
        description: "Soft spongy chenna balls soaked in light sugar syrup",
        price: 210,
        quantity: 1,
        category: "Sweets",
        taxApplicable: true,
        baseAmount: 200,
        tax: 10,
        itemCode: "BKV225",
        type: "Veg",
      },
      {
        id: 2,
        name: "Namkeen Mixture",
        size: "200g",
        description: "Classic Bikano-style crunchy mixture of lentils, nuts and sev",
        price: 85,
        quantity: 1,
        category: "Namkeen",
        taxApplicable: true,
        baseAmount: 81,
        tax: 4,
        itemCode: "BKV340",
      },
    ],
    subtotal: 515,
    tax: 26,
    total: 541,
  },

  hist2: {
    id: "BKNVLDEL5590LP",
    date: "15-12-2025",
    time: "12:45:33",
    associate: "Sanjay Reddy",
    branch: "Naraina, New Delhi",
    items: [
      {
        id: 0,
        name: "Moong Dal Halwa",
        size: "500g",
        description: "Slow-cooked lentil halwa in pure desi ghee, a Bikanervala signature",
        price: 340,
        quantity: 1,
        category: "Sweets",
        taxApplicable: true,
        baseAmount: 324,
        tax: 16,
        itemCode: "BKV142",
        type: "Veg",
      },
      {
        id: 1,
        name: "Gulab Jamun",
        size: "1 Kg",
        description: "Soft khoya dumplings soaked in rose-cardamom sugar syrup",
        price: 230,
        quantity: 1,
        category: "Sweets",
        taxApplicable: true,
        baseAmount: 219,
        tax: 11,
        itemCode: "BKV256",
        type: "Veg",
      },
      {
        id: 2,
        name: "Aloo Bhujia",
        size: "200g",
        description: "Spicy potato and gram flour sev, a namkeen classic",
        price: 80,
        quantity: 1,
        category: "Namkeen",
        taxApplicable: true,
        baseAmount: 76,
        tax: 4,
        itemCode: "BKV365",
      },
    ],
    subtotal: 650,
    tax: 33,
    total: 683,
  },
};
  
  const currentReceipt = receipts[currentReceiptId]

  const totalSlides = 2

  const transactionHistory = [
  {
    id: "current",
    date: "05-03-2026",
    branch: "Bikanervala",
    amount: currentReceiptId === "current" ? receipts.current.subtotal + receipts.current.tax : 765.00,
  },
  { id: "hist1", date: "20-01-2026", branch: "Bikanervala", amount: 541.00 },
  { id: "hist2", date: "15-12-2025", branch: "Bikanervala", amount: 683.00 },
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

    // Calculate position relative to container
    const relativeTop = buttonRect.top - containerRect.top
    const relativeLeft = buttonRect.left - containerRect.left

    // Modal dimensions (approximate)
    const modalWidth = Math.min(400, containerRect.width - 32)
    const modalHeight = 400

    // Calculate ideal top position (above button, with offset)
    let top = Math.max(16, relativeTop - modalHeight - 8)

    // If modal would go off top, place it below button
    if (top < 16) {
      top = relativeTop + buttonRect.height + 8
    }

    // If still too high, center it vertically
    if (top + modalHeight > containerRect.height) {
      top = Math.max(16, (containerRect.height - modalHeight) / 2)
    }

    // Calculate ideal left position (centered on button)
    let left = relativeLeft + buttonRect.width / 2 - modalWidth / 2

    // Keep modal within horizontal bounds
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
    window.open(`mailto:?subject=Receipt from Bikanervala&body=Order ID: ${currentReceipt.id}`)
}

  const handleDownloadReceipt = () => {
    const receiptContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Bikanervala Digital Receipt</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Poppins',sans-serif;font-size:14px;color:#111;background:#fff;width:800px;margin:0 auto;padding:24px;}
.receipt-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:16px;border-bottom:3px solid #E32E00;}
.company-info h1{font-size:30px;color:#E32E00;font-weight:700;margin-bottom:4px;}
.company-info p{font-size:12px;color:#555;line-height:1.4;}
.bill-info{text-align:right;font-size:12px;}
.bill-info div{margin-bottom:4px;}
.bill-id{font-weight:600;color:#E32E00;}
.customer-section{background:#FDF1EC;padding:14px;border-left:4px solid #E32E00;border-radius:0 8px 8px 0;margin-bottom:22px;}
.customer-section h3{font-size:15px;color:#E32E00;font-weight:600;margin-bottom:2px;}
.customer-section p{font-size:12px;color:#666;}
.items-table{width:100%;border-collapse:collapse;margin-bottom:24px;}
.items-table th{background:#E32E00;color:white;padding:10px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;}
.items-table td{padding:12px 8px;border-bottom:1px solid #eee;font-size:12px;vertical-align:top;}
.item-name{font-weight:600;margin-bottom:3px;}
.item-desc{font-size:11px;color:#666;}
.item-specs{font-size:10px;color:#E32E00;margin-top:4px;font-weight:600;}
.totals-section{display:flex;justify-content:space-between;margin-bottom:20px;}
.items-count{font-weight:600;}
.totals-table{text-align:right;min-width:200px;}
.totals-table div{margin-bottom:6px;font-size:13px;}
.net-total{font-size:18px;font-weight:700;color:#E32E00;border-top:2px solid #E32E00;padding-top:6px;margin-top:6px;}
.footer{text-align:center;margin-top:30px;padding-top:20px;border-top:1px dashed #ccc;font-size:12px;color:#555;}
.footer strong{color:#E32E00;}
.powered{margin-top:10px;font-size:10px;color:#999;font-weight:600;}
@media print{body{-webkit-print-color-adjust:exact;width:100%;padding:0;}}
</style>
</head>
<body>

<div class="receipt-header">
  <div class="company-info">
    <h1>Bikanervala</h1>
    <p>
      <strong>Bikanervala Foods Pvt. Ltd.</strong><br>
      A-28, Lawrence Road Industrial Area<br>
      Keshav Puram, Shakurpur<br>
      New Delhi, Delhi 110035
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
  <p>Thanks for enjoying Bikanervala with us!</p>
</div>

<table class="items-table">
  <thead>
    <tr>
      <th style="width:50%">Product</th>
      <th style="width:10%">Qty</th>
      <th style="width:15%">Size</th>
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
      <td>₹${item.price}</td>
      <td><strong>₹${(item.price * item.quantity).toFixed(2)}</strong></td>
    </tr>`).join('')}
  </tbody>
</table>

<div class="totals-section">
  <div class="items-count">Items Ordered: ${currentReceipt.items.length}</div>
  <div class="totals-table">
    <div>Subtotal: <strong>₹${currentReceipt.subtotal.toFixed(2)}</strong></div>
    <div>GST (5%): <strong>₹${currentReceipt.tax.toFixed(2)}</strong></div>
    <div class="net-total">Total: <strong>₹${currentReceipt.total.toFixed(2)}</strong></div>
  </div>
</div>

<div class="footer">
  <p><strong>Dhanyawad! See you again at Bikanervala.</strong></p>
  <p>Order again at www.bikanervala.com</p>
  <div class="powered">Powered by RDEP</div>
</div>

</body>
</html>
  `

    const blob = new Blob([receiptContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Bikanervala_Receipt_${currentReceipt.id}.html`
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
  <div className="bg-[#E32E00] px-5 pt-5 pb-6 text-white">
    <div className="flex items-start justify-between">

      {/* Bikanervala Logo */}
      <img
        src="/images/design-mode/Bikanervala_Logo.png"
        alt="Bikanervala"
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
        Namaste {customerName}
      </div>
      <div className="text-sm opacity-90">
        Your Bikanervala order is confirmed
      </div>
    </div>

    {/* Amount */}
    <div className="mt-4 bg-[#FF7A3D] rounded-xl p-4 flex justify-between items-center">
      <div>
        <div className="text-xs opacity-80">
          Amount Paid
        </div>
        <div className="text-3xl font-semibold">
          ₹{currentReceipt.total.toFixed(2)}
        </div>
      </div>
      <User2 className="h-7 w-7 text-white/80" />
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
    <h3 className="text-lg font-semibold flex items-center text-[#E32E00]">
      <ShoppingBagIcon className="mr-2 h-5 w-5" />
      Your Bikanervala Order
    </h3>
    <span className="text-xs font-medium border border-[#E32E00] text-[#E32E00] px-2 py-1 rounded-full">
      {currentReceipt.items.length} items
    </span>
  </div>

  <div className="space-y-3">
    {currentReceipt.items.map((product) => (
      <div key={product.id} className="bg-[#FDF1EC] rounded-xl p-3 border border-[#F6D9CC]">

        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleProductExpansion(product.id)}>
          <div className="flex items-center flex-1">
            <ChevronRight className={`h-4 w-4 mr-2 text-[#E32E00] transition-transform duration-200 ${expandedProducts.includes(product.id) ? "rotate-90" : ""}`} />
            <div>
              <div className="font-medium text-sm text-gray-900">{product.name}</div>
              <div className="text-xs text-gray-500">{product.category} · {product.size}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Qty {product.quantity}</div>
            <div className="font-semibold text-sm text-[#E32E00]">₹{(product.price * product.quantity).toFixed(2)}</div>
          </div>
        </div>

        {expandedProducts.includes(product.id) && (
          <div className="mt-3 pt-3 border-t border-[#F6D9CC] text-xs text-gray-600 grid grid-cols-2 gap-y-1">
            <div>Item Code: {product.itemCode}</div>
            <div>Pack Size: {product.size}</div>
            <div>Base: ₹{product.baseAmount?.toFixed(2)}</div>
            <div>Tax: ₹{product.tax?.toFixed(2)}</div>
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
      className="text-xs text-[#E32E00] font-medium"
    >
      Edit
    </button>
  </div>
) : (
  <button
    onClick={() => toggleItemFeedback(product.id)}
    className="text-xs text-[#FF7A3D] font-medium"
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
              {[1,2,3,4,5].map((star) => (
                <button key={star} onClick={() => setItemRating(product.id, star)}>
                  <Star className={`h-5 w-5 ${star <= (itemFeedback[product.id]?.rating || 0) ? "fill-[#E32E00] text-[#E32E00]" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Taste","Freshness","Packaging","Value"].map((tag) => {
                const active = itemFeedback[product.id]?.tags?.includes(tag)
                return (
                  <button key={tag} onClick={() => toggleItemTag(product.id, tag)}
                    className={`text-[11px] px-2 py-1 rounded-full border ${active ? "bg-[#E32E00] text-white border-[#E32E00]" : "border-gray-200"}`}>
                    {tag}
                  </button>
                )
              })}
            </div>
            <div className="mt-4">
  <button
    onClick={() => submitItemFeedback(product.id)}
    className="w-full bg-[#E32E00] hover:bg-[#c72800] text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
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
    <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{currentReceipt.subtotal.toFixed(2)}</span></div>
    <div className="flex justify-between"><span className="text-gray-600">Tax (GST)</span><span>₹{currentReceipt.tax.toFixed(2)}</span></div>
    <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
      <span>Total Paid</span><span className="text-[#E32E00]">₹{currentReceipt.total.toFixed(2)}</span>
    </div>
  </div>

  {/* Payment */}
  <div className="mt-5">
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-[#E32E00] rounded-lg flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        </div>
        <div>
          <div className="text-xs font-medium">Card Payment</div>
          <div className="text-xs text-gray-500">**** **** **** 4532</div>
        </div>
      </div>
      <div className="text-sm font-semibold text-[#E32E00]">₹{currentReceipt.total.toFixed(2)}</div>
    </div>
  </div>
</div>
          
          {/* Bikanervala Promo Banners */}
  
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden mx-3 mt-4 relative font-poppins">

  <Carousel className="w-full" setApi={setPromoApi} opts={{ loop: true }}>
    <CarouselContent>

      {/* Banner 1 — Gifting Hampers */}
      <CarouselItem>
        <div className="relative w-full aspect-square bg-[#FDF1EC]">
          <a href="https://bikanervala.com/collections/gifting" target="_blank" rel="noopener noreferrer" className="absolute inset-0">
            <Image src="/images/design-mode/hamper_1.png" alt="Bikanervala Gift Hampers" fill className="object-contain" priority />
          </a>
          <a href="https://bikanervala.com/collections/gifting" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4">
            <button className="bg-[#E32E00] text-white text-xs font-medium px-4 py-2 rounded-lg shadow-sm">Shop Hampers</button>
          </a>
        </div>
      </CarouselItem>

      {/* Banner 2 — Sweets */}
      <CarouselItem>
        <div className="relative w-full aspect-square bg-[#FDF1EC]">
          <a href="https://bikanervala.com/collections/sweets" target="_blank" rel="noopener noreferrer" className="absolute inset-0">
            <Image src="/images/design-mode/11._F3716__Khoya_Modak.png" alt="Bikanervala Fresh Sweets" fill className="object-contain" />
          </a>
          <a href="https://bikanervala.com/collections/sweets" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4">
            <button className="bg-[#E32E00] text-white text-xs font-medium px-4 py-2 rounded-lg shadow-sm">Shop Sweets</button>
          </a>
        </div>
      </CarouselItem>

    </CarouselContent>

    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
      {[0, 1].map((index) => (
        <button key={index} onClick={() => promoApi?.scrollTo(index)}
          className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? "w-5 bg-[#E32E00]" : "w-1.5 bg-white/70"}`} />
      ))}
    </div>
  </Carousel>
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
      <div className="text-xs text-gray-500">Your input helps us improve every Bikanervala experience.</div>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-[#E32E00] p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M11.5 2C7 2 3.5 5.3 3.5 9.5c0 2.4 1.2 4.4 3.1 5.7L6 22l5.1-2.6c.5.1 1 .1 1.5.1 4.5 0 8-3.3 8-7.5S16 2 11.5 2z"/>
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900">Rate Your Bikanervala Experience</h3>
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
            ? "fill-[#E32E00] text-[#E32E00]"
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
              ? ["Great taste","Fresh & authentic","Well packaged","Good value","Fast service","Order was accurate"]
              : ["Not fresh","Slow service","Wrong order","Taste could be better","Packaging issue","Not good value"]
            ).map((item) => (
              <button key={item}
                onClick={() => setSelectedTags((prev) => prev.includes(item) ? prev.filter((tag) => tag !== item) : [...prev, item])}
                className={`text-[11px] px-3 py-1.5 rounded-full border transition ${selectedTags.includes(item) ? "bg-[#E32E00] text-white border-[#E32E00]" : "border-gray-200 bg-gray-50"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Additional Feedback (Optional)</label>
        <textarea rows={3} placeholder="Tell us about your Bikanervala order"
          className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#E32E00] focus:border-[#E32E00] outline-none resize-none"
          value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} />
      </div>

      <button className="w-full bg-[#E32E00] text-white h-10 text-xs font-semibold rounded-xl transition active:scale-[0.98]"
        onClick={handleFeedbackSubmit} disabled={!rating}>
        Submit Feedback
      </button>

      <p className="text-[10px] text-center text-gray-400">Your feedback helps Bikanervala improve every order.</p>
    </div>
  )}
</div>          
         <div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">
  <div className="grid grid-cols-3 gap-3">
    <button ref={historyButtonRef} onClick={handleTransactionHistoryOpen}
      className="flex flex-col items-center justify-center bg-[#FDF1EC] border border-[#F6D9CC] rounded-xl py-3 active:scale-[0.98]">
      <History className="h-5 w-5 text-[#E32E00] mb-1" />
      <span className="text-[11px] font-medium text-gray-700">Orders</span>
    </button>

    <button onClick={handleEmailReceipt}
      className="flex flex-col items-center justify-center bg-[#FDF1EC] border border-[#F6D9CC] rounded-xl py-3 active:scale-[0.98]">
      <Mail className="h-5 w-5 text-[#E32E00] mb-1" />
      <span className="text-[11px] font-medium text-gray-700">Email</span>
    </button>

    <button onClick={handleDownloadReceipt}
      className="flex flex-col items-center justify-center bg-[#FDF1EC] border border-[#F6D9CC] rounded-xl py-3 active:scale-[0.98]">
      <Download className="h-5 w-5 text-[#E32E00] mb-1" />
      <span className="text-[11px] font-medium text-gray-700">Download</span>
    </button>
  </div>
</div>
          
       <div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">
  <div className="flex items-center mb-3">
    <div className="bg-[#E32E00] p-2 rounded-lg mr-3">
      <Send className="h-4 w-4 text-white" />
    </div>
    <h3 className="text-sm font-semibold text-gray-900">Bikanervala Support</h3>
  </div>

  <div className="grid grid-cols-3 gap-3">
    <button onClick={handleWhatsApp} className="flex flex-col items-center justify-center bg-[#FDF1EC] border border-[#F6D9CC] rounded-xl py-3 active:scale-[0.98]">
      <MessageSquare className="h-5 w-5 text-[#E32E00] mb-1" />
      <span className="text-[11px] font-medium text-gray-700">Chat</span>
    </button>
    <button onClick={handleCall} className="flex flex-col items-center justify-center bg-[#FDF1EC] border border-[#F6D9CC] rounded-xl py-3 active:scale-[0.98]">
      <Phone className="h-5 w-5 text-[#E32E00] mb-1" />
      <span className="text-[11px] font-medium text-gray-700">Call</span>
    </button>
    <button onClick={handleEmail} className="flex flex-col items-center justify-center bg-[#FDF1EC] border border-[#F6D9CC] rounded-xl py-3 active:scale-[0.98]">
      <Mail className="h-5 w-5 text-[#E32E00] mb-1" />
      <span className="text-[11px] font-medium text-gray-700">Email</span>
    </button>
  </div>
</div>
          
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">

  <div className="flex items-center mb-4">
    <div className="bg-[#E32E00] p-2 rounded-lg mr-3">
      <Share2 className="h-4 w-4 text-white" />
    </div>
    <h3 className="text-sm font-semibold text-gray-900">Stay Connected</h3>
  </div>

  <div className="flex justify-center space-x-6 mb-4">
    <button onClick={() => handleSocialLink("https://www.instagram.com/bikanervala.in/")} className="flex flex-col items-center">
      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center mb-1">
        <Instagram className="h-4 w-4 text-white" />
      </div>
      <span className="text-[11px] font-medium text-gray-700">Instagram</span>
    </button>

    <button onClick={() => handleSocialLink("https://www.facebook.com/bikanervala.in/")} className="flex flex-col items-center">
      <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center mb-1">
        <Facebook className="h-4 w-4 text-white" />
      </div>
      <span className="text-[11px] font-medium text-gray-700">Facebook</span>
    </button>

    <button onClick={() => handleSocialLink("https://bikanervala.com")} className="flex flex-col items-center">
      <div className="w-9 h-9 rounded-full bg-[#E32E00] flex items-center justify-center mb-1">
        <ExternalLink className="h-4 w-4 text-white" />
      </div>
      <span className="text-[11px] font-medium text-gray-700">Website</span>
    </button>
  </div>

  {/* Store Location */}
  <div className="text-xs text-gray-600 text-center mb-3 bg-gray-50 p-3 rounded-xl">
    <button onClick={() => setShowStoreLocation(!showStoreLocation)}
      className="w-full flex items-center justify-center mb-2 hover:text-[#E32E00] transition-colors">
      <MapPin className="h-3 w-3 mr-1 text-[#E32E00]" />
      <span className="font-semibold text-[#E32E00]">
        Bikanervala – {currentReceipt.branch} {showStoreLocation ? "▲" : "▼"}
      </span>
    </button>

    {showStoreLocation && (
      <div className="space-y-0.5">
        <p className="font-semibold text-gray-900">Bikanervala Foods Pvt. Ltd.</p>
        <p>A-28, Lawrence Road Industrial Area</p>
        <p>Keshav Puram, Shakurpur</p>
        <p>New Delhi, Delhi 110035</p>
        <p>India</p>
        <p className="mt-2 text-[10px]">GSTIN: 07XXXXX0000X1Z5</p>
        <p className="mt-1 text-[#E32E00] font-semibold">Store Manager: {currentReceipt.associate}</p>
      </div>
    )}
  </div>

  {/* Terms */}
  <button className="w-full text-xs text-gray-500 hover:text-[#E32E00] h-6 font-medium" onClick={() => setShowTerms(!showTerms)}>
    Terms & Conditions {showTerms ? "▲" : "▼"}
  </button>

  {showTerms && (
    <div className="text-[11px] text-gray-500 mt-2 space-y-1 px-2 font-medium">
      <p>• Offers and coupons are subject to availability and location.</p>
      <p>• Prices include applicable GST.</p>
      <p>• Bikanervala Club Points are non-transferable and valid for 12 months from credit.</p>
      <p>• For support visit www.bikanervala.com.</p>
    </div>
  )}

  <div className="text-center mt-3 pt-3 border-t border-gray-100">
  <div className="flex items-center justify-center space-x-1.5">
    <span className="text-xs text-gray-400 font-medium">Powered by</span>
    <span className="text-sm font-bold tracking-tight" style={{ color: "#003323" }}>
      SmartBill
    </span>
  </div>
</div>
</div>
          <div id="height-marker" style={{ height: "1px" }} />
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div
            style={getModalPositionRelativeToContainer(feedbackButtonRef)}
            className="bg-white rounded-lg w-full overflow-hidden shadow-xl z-[9999] max-w-sm"
          >
            <div className="flex justify-between items-center p-4 border-b bg-blue-700 text-white">
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
                { key: "style", label: "Shoe Style/Design" },
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
                              ? "text-yellow-400 fill-yellow-400"
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
              <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white" onClick={handleFeedbackSubmit}>
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
          <div className="bg-[#E32E00] p-2 rounded-lg mr-3">
            <History className="h-4 w-4 text-white" />
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
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
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
            className="w-full flex items-center p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#E32E00] transition"
          >

            <div className="bg-white border border-gray-200 p-2 rounded-lg mr-3">
              <FileText className="h-4 w-4 text-[#E32E00]" />
            </div>

            <div className="flex-grow text-left">
              <div className="text-sm font-semibold text-gray-900">
                Bikanervala
              </div>
              <div className="text-[11px] text-gray-500">
                {transaction.date}
              </div>
            </div>

            <div className="text-sm font-semibold text-[#E32E00]">
              ₹{transaction.amount.toFixed(2)}
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
            <div className="flex justify-between items-center p-4 border-b bg-blue-700 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Refer & Earn
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-600"
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
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="h-8 w-8 text-blue-700" />
                </div>
                <h4 className="text-lg font-semibold text-blue-700 mb-2">Share & Earn RM50!</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Refer friends to Skechers and both of you get RM50 off your next purchase!
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-xs font-medium text-blue-800 mb-1">Your Referral Code</div>
                <div className="text-lg font-bold text-blue-700 text-center">SKECH{customerName.toUpperCase()}50</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Try Skechers! Use code SKECH${customerName.toUpperCase()}50 for RM50 off!`,
                    )
                    setShowReferModal(false)
                  }}
                >
                  Copy Code
                </Button>
                <Button
                  className="bg-blue-700 hover:bg-blue-800 text-white"
                  onClick={() => {
                    window.open(
                      `https://wa.me/60362032728?text=Try Skechers Malaysia! Use my code SKECH${customerName.toUpperCase()}50 for RM50 off your next purchase!`,
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
