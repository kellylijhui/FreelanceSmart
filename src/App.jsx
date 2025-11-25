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
  
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [aiError, setAiError] = useState(null)
  const fileInputRef = useRef(null)

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

  const emailProposal = useMemo(() => {
    const addons = []
    if (rushDelivery) addons.push('Rush Delivery')
    if (includesRevisions) addons.push('3 Revisions Included')
    if (sourceFiles) addons.push('Source Files Included')
    if (friendsFamily) addons.push('Friends & Family Discount (15% off)')

    const addonsText = addons.length > 0 ? `\n\nThis quote includes: ${addons.join(', ')}.` : ''

    return `Dear Client,

Thank you for considering me for your ${projectTypeLabel.toLowerCase()} project. I'm excited about the opportunity to work with you.

Based on our discussion, I'm pleased to provide the following quote:

Project Type: ${projectTypeLabel}
Estimated Hours: ${estimatedHours} hours
Hourly Rate: $${hourlyRate.toFixed(2)}

Total Estimated Quote: $${calculations.total.toFixed(2)}${addonsText}

This quote is valid for 30 days. Please don't hesitate to reach out if you have any questions or would like to discuss the project further.

Looking forward to working together!

Best regards,
[Your Name]`
  }, [projectType, projectTypeLabel, estimatedHours, hourlyRate, calculations.total, rushDelivery, includesRevisions, sourceFiles, friendsFamily])

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(emailProposal)
      setCopied(true)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">FreelanceSmart</h1>
              <p className="text-sm text-slate-500">Professional Quote Generator for Freelance Creatives</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Project Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all text-slate-800"
                    placeholder="Enter your hourly rate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Type
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all text-slate-800 bg-white"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estimated Hours: <span className="font-bold text-slate-900">{estimatedHours}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="200"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1 hr</span>
                    <span>200 hrs</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-medium text-slate-700 mb-4">Add-ons & Discounts</h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rushDelivery}
                        onChange={(e) => setRushDelivery(e.target.checked)}
                        className="mt-1 w-4 h-4 text-slate-700 border-slate-300 rounded focus:ring-slate-500"
                      />
                      <div>
                        <span className="text-slate-800 group-hover:text-slate-900">Rush Delivery</span>
                        <span className="block text-xs text-slate-500">Add 25% to base price</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={includesRevisions}
                        onChange={(e) => setIncludesRevisions(e.target.checked)}
                        className="mt-1 w-4 h-4 text-slate-700 border-slate-300 rounded focus:ring-slate-500"
                      />
                      <div>
                        <span className="text-slate-800 group-hover:text-slate-900">Includes 3 Revisions</span>
                        <span className="block text-xs text-slate-500">Add fixed fee of $150</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={sourceFiles}
                        onChange={(e) => setSourceFiles(e.target.checked)}
                        className="mt-1 w-4 h-4 text-slate-700 border-slate-300 rounded focus:ring-slate-500"
                      />
                      <div>
                        <span className="text-slate-800 group-hover:text-slate-900">Source Files Included</span>
                        <span className="block text-xs text-slate-500">Add 10% to base price</span>
                      </div>
                    </label>

                    <div className="border-t border-slate-100 pt-3 mt-3">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={friendsFamily}
                          onChange={(e) => setFriendsFamily(e.target.checked)}
                          className="mt-1 w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
                        />
                        <div>
                          <span className="text-slate-800 group-hover:text-slate-900 flex items-center gap-2">
                            Friends & Family Discount
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800">
                              15% OFF
                            </span>
                          </span>
                          <span className="block text-xs text-slate-500">Special discount for friends and family</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Rate Advisor
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Upload a sample of your past work and our AI will suggest an appropriate hourly rate based on quality and market standards.
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
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all"
                  >
                    <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-slate-600">Click to upload your work sample</span>
                    <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</span>
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Work sample"
                      className="w-full h-40 object-cover rounded-xl"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
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
                    className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {analyzing ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing your work...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Analyze & Get Rate Suggestion
                      </>
                    )}
                  </button>
                )}

                {aiError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{aiError}</p>
                  </div>
                )}

                {aiSuggestion && (
                  <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-violet-800">AI Analysis Complete</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-slate-500">Suggested Rate</p>
                        <p className="text-2xl font-bold text-violet-700">${aiSuggestion.suggestedHourlyRate}/hr</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-slate-500">Rate Range</p>
                        <p className="text-lg font-semibold text-slate-700">
                          ${aiSuggestion.rateRange?.min} - ${aiSuggestion.rateRange?.max}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Skill Level</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        aiSuggestion.skillLevel === 'expert' ? 'bg-purple-100 text-purple-800' :
                        aiSuggestion.skillLevel === 'advanced' ? 'bg-blue-100 text-blue-800' :
                        aiSuggestion.skillLevel === 'intermediate' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {aiSuggestion.skillLevel?.charAt(0).toUpperCase() + aiSuggestion.skillLevel?.slice(1)}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600">{aiSuggestion.reasoning}</p>

                    <button
                      onClick={handleApplySuggestion}
                      className="w-full py-2.5 px-4 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Apply ${aiSuggestion.suggestedHourlyRate}/hr Rate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Quote Summary
              </h2>

              <div className="text-center py-6 mb-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                <p className="text-sm text-slate-600 mb-2">Total Estimated Quote</p>
                <p className="text-5xl font-bold text-slate-800">
                  ${calculations.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {friendsFamily && (
                  <p className="text-sm text-pink-600 mt-2 font-medium">
                    Friends & Family discount applied!
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-700">Price Breakdown</h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Base ({estimatedHours} hrs × ${hourlyRate})</span>
                    <span className="font-medium text-slate-800">${calculations.basePrice.toFixed(2)}</span>
                  </div>
                  {calculations.rushFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Rush Delivery (+25%)</span>
                      <span className="font-medium text-amber-600">+${calculations.rushFee.toFixed(2)}</span>
                    </div>
                  )}
                  {calculations.revisionFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">3 Revisions (fixed)</span>
                      <span className="font-medium text-amber-600">+${calculations.revisionFee.toFixed(2)}</span>
                    </div>
                  )}
                  {calculations.sourceFileFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Source Files (+10%)</span>
                      <span className="font-medium text-amber-600">+${calculations.sourceFileFee.toFixed(2)}</span>
                    </div>
                  )}
                  {calculations.friendsFamilyDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-pink-600">Friends & Family (-15%)</span>
                      <span className="font-medium text-pink-600">-${calculations.friendsFamilyDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-2 mt-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-800">Total</span>
                      <span className="text-slate-800">${calculations.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Client Email Proposal
              </h2>

              <textarea
                readOnly
                value={emailProposal}
                className="w-full h-64 px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-700 resize-none focus:outline-none"
              />

              <button
                onClick={handleCopyToClipboard}
                className={`mt-4 w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  copied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy Proposal to Clipboard
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            FreelanceSmart Quote Generator - Price your work with confidence
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
