import { useState, useMemo, useRef } from 'react'

const PROJECT_TYPES = [
  { value: 'logo', label: 'Logo Design' },
  { value: 'copywriting', label: 'Copywriting' },
  { value: 'webdev', label: 'Web Development' },
  { value: 'consultation', label: 'Consultation' },
]

function App() {
  const [hourlyRate, setHourlyRate] = useState(50)
  const [projectType, setProjectType] = useState('logo')
  const [estimatedHours, setEstimatedHours] = useState(10)
  const [rushDelivery, setRushDelivery] = useState(false)
  const [includesRevisions, setIncludesRevisions] = useState(false)
  const [sourceFiles, setSourceFiles] = useState(false)
  const [friendsFamily, setFriendsFamily] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('proposal')
  
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [aiError, setAiError] = useState(null)
  const fileInputRef = useRef(null)

  const [clientName, setClientName] = useState('[Client Name]')
  const [yourName, setYourName] = useState('[Your Name]')
  const [yourEmail, setYourEmail] = useState('[your@email.com]')
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001')

  const calculations = useMemo(() => {
    const basePrice = hourlyRate * estimatedHours
    const rushFee = rushDelivery ? basePrice * 0.25 : 0
    const revisionFee = includesRevisions ? 150 : 0
    const sourceFileFee = sourceFiles ? basePrice * 0.10 : 0
    const subtotal = basePrice + rushFee + revisionFee + sourceFileFee
    const friendsFamilyDiscount = friendsFamily ? subtotal * 0.15 : 0
    const total = subtotal - friendsFamilyDiscount

    return {
      basePrice,
      rushFee,
      revisionFee,
      sourceFileFee,
      friendsFamilyDiscount,
      subtotal,
      total,
    }
  }, [hourlyRate, estimatedHours, rushDelivery, includesRevisions, sourceFiles, friendsFamily])

  const projectTypeLabel = PROJECT_TYPES.find(p => p.value === projectType)?.label || 'Project'

  const todayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const emailProposal = useMemo(() => {
    const addons = []
    if (rushDelivery) addons.push('Rush Delivery')
    if (includesRevisions) addons.push('3 Revisions Included')
    if (sourceFiles) addons.push('Source Files Included')
    if (friendsFamily) addons.push('Friends & Family Discount (15% off)')

    const addonsText = addons.length > 0 ? `\n\nThis quote includes: ${addons.join(', ')}.` : ''
    
    const aiRateText = aiSuggestion ? `\n\nRATE ANALYSIS:\nBased on our AI analysis of your portfolio work, we've determined an hourly rate of CAD $${hourlyRate}/hr is appropriate. ${aiSuggestion.reasoning}` : ''

    return `Dear ${clientName},

Thank you for considering me for your ${projectTypeLabel.toLowerCase()} project. I'm excited about the opportunity to work with you.

Based on our discussion, I'm pleased to provide the following quote:

Project Type: ${projectTypeLabel}
Estimated Hours: ${estimatedHours} hours
Hourly Rate: CAD $${hourlyRate.toFixed(2)}

Total Estimated Quote: CAD $${calculations.total.toFixed(2)}${addonsText}${aiRateText}

This quote is valid for 30 days. Please don't hesitate to reach out if you have any questions or would like to discuss the project further.

Looking forward to working together!

Best regards,
${yourName}`
  }, [projectType, projectTypeLabel, estimatedHours, hourlyRate, calculations.total, rushDelivery, includesRevisions, sourceFiles, friendsFamily, clientName, yourName, aiSuggestion])

  const generateInvoice = () => {
    const lineItems = []
    lineItems.push({
      description: `${projectTypeLabel} - ${estimatedHours} hours @ CAD $${hourlyRate}/hr`,
      amount: calculations.basePrice
    })
    if (calculations.rushFee > 0) {
      lineItems.push({ description: 'Rush Delivery (25% surcharge)', amount: calculations.rushFee })
    }
    if (calculations.revisionFee > 0) {
      lineItems.push({ description: '3 Revisions Package', amount: calculations.revisionFee })
    }
    if (calculations.sourceFileFee > 0) {
      lineItems.push({ description: 'Source Files (10%)', amount: calculations.sourceFileFee })
    }
    if (calculations.friendsFamilyDiscount > 0) {
      lineItems.push({ description: 'Friends & Family Discount (15%)', amount: -calculations.friendsFamilyDiscount })
    }

    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Invoice #: ${invoiceNumber}
Invoice Date: ${todayDate}
Due Date: ${dueDate} (Net 30)

FROM:
${yourName}
Email: ${yourEmail}

TO:
${clientName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SERVICES PROVIDED

${lineItems.map(item => `${item.description.padEnd(45)} CAD $${item.amount.toFixed(2)}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${'TOTAL DUE:'.padEnd(45)} CAD $${calculations.total.toFixed(2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT TERMS:
• Payment due within 30 days of invoice date
• Late payments subject to 1.5% monthly interest
• Payment accepted via Bank Transfer, PayPal, or Check

Thank you for your business!
${yourName}`
  }

  const generateContract = () => {
    const addons = []
    if (rushDelivery) addons.push('expedited delivery timeline')
    if (includesRevisions) addons.push('up to 3 rounds of revisions')
    if (sourceFiles) addons.push('delivery of all source files')

    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        FREELANCE SERVICE AGREEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This Agreement is entered into on ${todayDate}

BETWEEN:
Service Provider: ${yourName}
Email: ${yourEmail}

AND:
Client: ${clientName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SCOPE OF WORK

The Service Provider agrees to perform the following services:

• Project Type: ${projectTypeLabel}
• Estimated Time: ${estimatedHours} hours
• Deliverables: Professional ${projectTypeLabel.toLowerCase()} as discussed${addons.length > 0 ? `\n• Additional Services: ${addons.join(', ')}` : ''}

2. PROJECT TIMELINE

• Project Start: Upon signing of agreement and receipt of deposit
• Estimated Completion: ${estimatedHours} hours of work, completion within reasonable timeframe
• The Client will have 5 business days to review deliverables; silence constitutes acceptance

3. PAYMENT TERMS

• Total Project Fee: CAD $${calculations.total.toFixed(2)}
• Payment Schedule:
  - 50% deposit (CAD $${(calculations.total / 2).toFixed(2)}) due upon signing
  - 50% balance (CAD $${(calculations.total / 2).toFixed(2)}) due upon project completion
• Late payments subject to 1.5% monthly interest
• Additional work beyond scope will be billed at CAD $${hourlyRate}/hour

4. REVISIONS

• ${includesRevisions ? 'Up to 3 rounds of revisions included' : 'Up to 2 rounds of minor revisions included'}
• Additional revisions: CAD $${(hourlyRate * 0.75).toFixed(2)}/hour
• Revisions must be requested within 14 days of delivery

5. INTELLECTUAL PROPERTY

• All work remains property of Service Provider until full payment is received
• Upon full payment, Client receives full rights to use deliverables
• Service Provider retains right to display work in portfolio with Client's permission

6. CONFIDENTIALITY

Both parties agree to keep confidential any proprietary information shared during this project.

7. CANCELLATION POLICY

• Client may cancel with 14 days written notice
• If Client cancels:
  - Before work begins: Full refund minus 10% administrative fee
  - After work begins: Payment for all work completed plus 25% of remaining balance
• Service Provider may cancel with 14 days notice with full refund of any payments

8. TERMINATION

Either party may terminate this agreement with 30 days written notice. Upon termination, Client pays for all work completed to date.

9. LIABILITY

Service Provider's total liability shall not exceed the total project fee. Service Provider is not liable for any indirect, incidental, or consequential damages.

10. GENERAL TERMS

• This agreement constitutes the entire agreement between parties
• Any amendments must be in writing and signed by both parties
• This agreement is governed by the laws of [Your State/Country]
• Service Provider is an independent contractor, not an employee

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SIGNATURES

Service Provider: ${yourName}
Signature: _____________________  Date: _________

Client: ${clientName}
Signature: _____________________  Date: _________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Note: This is a template contract. Please consult with a legal professional to ensure it meets your specific needs and local regulations.`
  }

  const handleCopyToClipboard = async (text, type = 'proposal') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setAiError('Image size must be less than 10MB')
        return
      }
      setUploadedImage(file)
      setAiSuggestion(null)
      setAiError(null)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyzeWork = async () => {
    if (!uploadedImage) return

    setAnalyzing(true)
    setAiError(null)
    setAiSuggestion(null)

    try {
      const formData = new FormData()
      formData.append('image', uploadedImage)
      formData.append('projectType', projectTypeLabel)

      const response = await fetch('/api/analyze-work', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze image')
      }

      const data = await response.json()
      setAiSuggestion(data)
    } catch (err) {
      console.error('Error analyzing work:', err)
      setAiError(err.message || 'Failed to analyze your work. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleApplySuggestion = () => {
    if (aiSuggestion?.suggestedHourlyRate) {
      setHourlyRate(aiSuggestion.suggestedHourlyRate)
    }
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setImagePreview(null)
    setAiSuggestion(null)
    setAiError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  FreelanceSmart
                </h1>
                <p className="text-sm text-gray-600">Professional Quote & Contract Generator</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-gray-700 font-medium">AI-Powered Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 border border-purple-100">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800">Project Setup</h2>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={yourName}
                      onChange={(e) => setYourName(e.target.value)}
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-gray-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-gray-800 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (CAD $)</label>
                  <input
                    type="number"
                    min="0"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-gray-800 bg-white"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Hours: <span className="font-bold text-purple-600">{estimatedHours}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="200"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 hr</span>
                    <span>200 hrs</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Add-ons & Discounts</h3>
                  <div className="space-y-2.5">
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-purple-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={rushDelivery}
                        onChange={(e) => setRushDelivery(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <span className="text-gray-800 text-sm font-medium">Rush Delivery</span>
                        <span className="block text-xs text-gray-500">+25% surcharge</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-purple-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={includesRevisions}
                        onChange={(e) => setIncludesRevisions(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <span className="text-gray-800 text-sm font-medium">3 Revisions</span>
                        <span className="block text-xs text-gray-500">+CAD $150 flat fee</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-purple-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={sourceFiles}
                        onChange={(e) => setSourceFiles(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <span className="text-gray-800 text-sm font-medium">Source Files</span>
                        <span className="block text-xs text-gray-500">+10% of base</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-pink-50 transition-colors border-t border-pink-100 mt-2 pt-3">
                      <input
                        type="checkbox"
                        checked={friendsFamily}
                        onChange={(e) => setFriendsFamily(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                      />
                      <div className="flex-1">
                        <span className="text-gray-800 text-sm font-medium flex items-center gap-2">
                          Friends & Family
                          <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full">15% OFF</span>
                        </span>
                        <span className="block text-xs text-gray-500">Special discount</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h2 className="text-xl font-semibold">AI Rate Advisor</h2>
              </div>
              <p className="text-purple-100 text-sm mb-4">
                Upload your best work and get AI-powered pricing suggestions
              </p>

              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="work-upload"
                />
                
                {!imagePreview ? (
                  <label
                    htmlFor="work-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:bg-white/10 transition-all backdrop-blur"
                  >
                    <svg className="w-10 h-10 text-white/80 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-white/90">Click to upload work sample</span>
                    <span className="text-xs text-white/70 mt-1">PNG, JPG up to 10MB</span>
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Work sample"
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {imagePreview && !aiSuggestion && (
                  <button
                    onClick={handleAnalyzeWork}
                    disabled={analyzing}
                    className="w-full py-3 px-4 bg-white text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                  >
                    {analyzing ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Analyze & Get Rate
                      </>
                    )}
                  </button>
                )}

                {aiError && (
                  <div className="p-3 bg-red-500/20 border border-red-300/30 rounded-lg backdrop-blur">
                    <p className="text-sm text-white">{aiError}</p>
                  </div>
                )}

                {aiSuggestion && (
                  <div className="p-4 bg-white/95 backdrop-blur rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-purple-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">Analysis Complete</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-purple-600 mb-1">Suggested Rate</p>
                        <p className="text-2xl font-bold text-purple-700">CAD ${aiSuggestion.suggestedHourlyRate}/hr</p>
                      </div>
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <p className="text-xs text-pink-600 mb-1">Range</p>
                        <p className="text-lg font-semibold text-pink-700">
                          CAD ${aiSuggestion.rateRange?.min}-${aiSuggestion.rateRange?.max}
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Skill Level</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        aiSuggestion.skillLevel === 'expert' ? 'bg-purple-100 text-purple-800' :
                        aiSuggestion.skillLevel === 'advanced' ? 'bg-blue-100 text-blue-800' :
                        aiSuggestion.skillLevel === 'intermediate' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {aiSuggestion.skillLevel?.charAt(0).toUpperCase() + aiSuggestion.skillLevel?.slice(1)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">{aiSuggestion.reasoning}</p>

                    <button
                      onClick={handleApplySuggestion}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Apply CAD ${aiSuggestion.suggestedHourlyRate}/hr Rate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 border border-purple-100">
              <div className="text-center py-6 mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
                <p className="text-sm opacity-90 mb-2">Total Estimated Quote</p>
                <p className="text-5xl font-bold">
                  CAD ${calculations.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {friendsFamily && (
                  <p className="text-sm mt-2 bg-white/20 inline-block px-3 py-1 rounded-full">
                    Friends & Family discount applied
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-medium text-gray-700">Price Breakdown</h3>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base ({estimatedHours} hrs × CAD ${hourlyRate})</span>
                    <span className="font-medium text-gray-800">CAD ${calculations.basePrice.toFixed(2)}</span>
                  </div>
                  {calculations.rushFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rush Delivery (+25%)</span>
                      <span className="font-medium text-purple-600">+CAD ${calculations.rushFee.toFixed(2)}</span>
                    </div>
                  )}
                  {calculations.revisionFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">3 Revisions</span>
                      <span className="font-medium text-purple-600">+CAD ${calculations.revisionFee.toFixed(2)}</span>
                    </div>
                  )}
                  {calculations.sourceFileFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Source Files (+10%)</span>
                      <span className="font-medium text-purple-600">+CAD ${calculations.sourceFileFee.toFixed(2)}</span>
                    </div>
                  )}
                  {calculations.friendsFamilyDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-pink-600">Friends & Family (-15%)</span>
                      <span className="font-medium text-pink-600">-CAD ${calculations.friendsFamilyDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-purple-200 pt-2 mt-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-800">Total</span>
                      <span className="text-purple-700">CAD ${calculations.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 border-b border-purple-100 mb-4">
                <button
                  onClick={() => setActiveTab('proposal')}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === 'proposal'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Email Proposal
                </button>
                <button
                  onClick={() => setActiveTab('invoice')}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === 'invoice'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Invoice
                </button>
                <button
                  onClick={() => setActiveTab('contract')}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === 'contract'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Contract
                </button>
              </div>

              <div className="space-y-4">
                {activeTab === 'proposal' && (
                  <>
                    <textarea
                      readOnly
                      value={emailProposal}
                      className="w-full h-80 px-4 py-3 border border-purple-200 rounded-xl bg-white text-sm text-gray-700 resize-none focus:outline-none font-mono"
                    />
                    <button
                      onClick={() => handleCopyToClipboard(emailProposal, 'proposal')}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        copied === 'proposal'
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                      }`}
                    >
                      {copied === 'proposal' ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          Copy Proposal
                        </>
                      )}
                    </button>
                  </>
                )}

                {activeTab === 'invoice' && (
                  <>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                      <input
                        type="text"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 text-gray-800 text-sm"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                      <input
                        type="email"
                        value={yourEmail}
                        onChange={(e) => setYourEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 text-gray-800 text-sm"
                      />
                    </div>
                    <textarea
                      readOnly
                      value={generateInvoice()}
                      className="w-full h-96 px-4 py-3 border border-purple-200 rounded-xl bg-white text-sm text-gray-700 resize-none focus:outline-none font-mono"
                    />
                    <button
                      onClick={() => handleCopyToClipboard(generateInvoice(), 'invoice')}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        copied === 'invoice'
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                      }`}
                    >
                      {copied === 'invoice' ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Copy Invoice
                        </>
                      )}
                    </button>
                  </>
                )}

                {activeTab === 'contract' && (
                  <>
                    <textarea
                      readOnly
                      value={generateContract()}
                      className="w-full h-96 px-4 py-3 border border-purple-200 rounded-xl bg-white text-xs text-gray-700 resize-none focus:outline-none font-mono leading-relaxed"
                    />
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-xs text-yellow-800">
                        <strong>Legal Notice:</strong> This is a template contract for general use. Please consult with a legal professional to ensure it meets your specific needs and complies with local regulations.
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(generateContract(), 'contract')}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        copied === 'contract'
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                      }`}
                    >
                      {copied === 'contract' ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Copy Contract
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-purple-100 bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">FreelanceSmart</span> - Price your work with confidence
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
