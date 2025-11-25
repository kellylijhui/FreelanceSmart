import { useState, useMemo } from 'react'

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
  const [copied, setCopied] = useState(false)

  const calculations = useMemo(() => {
    const basePrice = hourlyRate * estimatedHours
    const rushFee = rushDelivery ? basePrice * 0.25 : 0
    const revisionFee = includesRevisions ? 150 : 0
    const sourceFileFee = sourceFiles ? basePrice * 0.10 : 0
    const total = basePrice + rushFee + revisionFee + sourceFileFee

    return {
      basePrice,
      rushFee,
      revisionFee,
      sourceFileFee,
      total,
    }
  }, [hourlyRate, estimatedHours, rushDelivery, includesRevisions, sourceFiles])

  const projectTypeLabel = PROJECT_TYPES.find(p => p.value === projectType)?.label || 'Project'

  const emailProposal = useMemo(() => {
    const addons = []
    if (rushDelivery) addons.push('Rush Delivery')
    if (includesRevisions) addons.push('3 Revisions Included')
    if (sourceFiles) addons.push('Source Files Included')

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
  }, [projectType, projectTypeLabel, estimatedHours, hourlyRate, calculations.total, rushDelivery, includesRevisions, sourceFiles])

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(emailProposal)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
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
                <h3 className="text-sm font-medium text-slate-700 mb-4">Add-ons</h3>
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
                </div>
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
