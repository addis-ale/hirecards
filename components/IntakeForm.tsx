'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  jobTitle: string;
  department: string;
  experienceLevel: string;
  location: string;
  workModel: string;
  salaryRange: string;
  companySize: string;
  keyResponsibilities: string;
  requiredSkills: string;
  hiringTimeline: string;
  teamSize: string;
  reportingTo: string;
}

export default function IntakeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    jobTitle: '',
    department: '',
    experienceLevel: '',
    location: '',
    workModel: '',
    salaryRange: '',
    companySize: '',
    keyResponsibilities: '',
    requiredSkills: '',
    hiringTimeline: '',
    teamSize: '',
    reportingTo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/generate-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Store cards in sessionStorage
        sessionStorage.setItem('battleCards', JSON.stringify(result.cards));
        sessionStorage.setItem('sessionId', result.sessionId);
        // Redirect to results page
        router.push('/results');
      } else {
        setError(result.error || 'Failed to generate cards');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* Basic Information */}
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <span>Basic Information</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                required
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="e.g., Senior Product Manager"
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
                Department *
              </label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">Select department</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Customer Success">Customer Success</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </select>
            </div>
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-semibold text-gray-700 mb-2">
                Experience Level *
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                required
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">Select level</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Principal">Principal</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            <div>
              <label htmlFor="workModel" className="block text-sm font-semibold text-gray-700 mb-2">
                Work Model *
              </label>
              <select
                id="workModel"
                name="workModel"
                required
                value={formData.workModel}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">Select work model</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <div>
              <label htmlFor="salaryRange" className="block text-sm font-semibold text-gray-700 mb-2">
                Salary Range *
              </label>
              <input
                type="text"
                id="salaryRange"
                name="salaryRange"
                required
                value={formData.salaryRange}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="e.g., $120k - $160k"
              />
            </div>
          </div>
        </div>

        {/* Company Context */}
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <span>Company Context</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companySize" className="block text-sm font-semibold text-gray-700 mb-2">
                Company Size *
              </label>
              <select
                id="companySize"
                name="companySize"
                required
                value={formData.companySize}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
            <div>
              <label htmlFor="teamSize" className="block text-sm font-semibold text-gray-700 mb-2">
                Team Size
              </label>
              <input
                type="text"
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="e.g., 5 people"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="reportingTo" className="block text-sm font-semibold text-gray-700 mb-2">
                Reports To
              </label>
              <input
                type="text"
                id="reportingTo"
                name="reportingTo"
                value={formData.reportingTo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="e.g., VP of Product"
              />
            </div>
          </div>
        </div>

        {/* Role Details */}
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <span>Role Details</span>
          </h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="keyResponsibilities" className="block text-sm font-semibold text-gray-700 mb-2">
                Key Responsibilities *
              </label>
              <textarea
                id="keyResponsibilities"
                name="keyResponsibilities"
                required
                rows={4}
                value={formData.keyResponsibilities}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="List the main responsibilities, separated by commas or new lines..."
              />
            </div>
            <div>
              <label htmlFor="requiredSkills" className="block text-sm font-semibold text-gray-700 mb-2">
                Required Skills *
              </label>
              <textarea
                id="requiredSkills"
                name="requiredSkills"
                required
                rows={3}
                value={formData.requiredSkills}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="List required skills, separated by commas..."
              />
            </div>
            <div>
              <label htmlFor="hiringTimeline" className="block text-sm font-semibold text-gray-700 mb-2">
                Hiring Timeline
              </label>
              <select
                id="hiringTimeline"
                name="hiringTimeline"
                value={formData.hiringTimeline}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">Select timeline</option>
                <option value="ASAP">ASAP</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="2-4 weeks">2-4 weeks</option>
                <option value="1-2 months">1-2 months</option>
                <option value="2-3 months">2-3 months</option>
                <option value="3+ months">3+ months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Your Battle Cards...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Generate Battle Card Deck</span>
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 text-center mt-4">
            This will take approximately 10-15 seconds
          </p>
        </div>
      </div>
    </form>
  );
}
