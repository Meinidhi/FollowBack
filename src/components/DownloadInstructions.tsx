import React from 'react';
import { Smartphone, CheckCircle, ArrowDownCircle } from 'lucide-react';
import { JsonFormatWarning } from './JsonFormatWarning';

interface DownloadInstructionsProps {
  onProceedToUpload: () => void;
}

export const DownloadInstructions: React.FC<DownloadInstructionsProps> = ({ onProceedToUpload }) => {
  const steps = [
    { num: 1, title: 'Open Instagram', desc: 'Open the Instagram app on your mobile device or navigate to instagram.com on your computer.' },
    { num: 2, title: 'Navigate to your profile', desc: 'Tap your profile picture in the bottom-right corner to open your profile page.' },
    { num: 3, title: 'Click the three-line menu (☰)', desc: 'Tap the hamburger menu icon in the top-right corner to open Settings and activity.' },
    { num: 4, title: 'Open Accounts Center', desc: 'Tap the Meta Accounts Center banner at the top of the menu.' },
    { num: 5, title: 'Select "Your information and permissions"', desc: 'Under the Account settings section, tap Your information and permissions.' },
    { num: 6, title: 'Select "Download your information"', desc: 'Tap the Download your information option.' },
    { num: 7, title: 'Click "Download or transfer information"', desc: 'Tap the blue Download or transfer information button to start your request.' },
    { num: 8, title: 'Select your Instagram account', desc: 'If multiple accounts are linked in your Meta Accounts Center, choose the Instagram account you wish to analyze.' },
    { num: 9, title: 'Choose "Some of your information"', desc: 'Select "Some of your information" to download only follower data. This makes the export much faster!' },
    { num: 10, title: 'Select "Followers and following"', desc: 'Scroll down to the Connections section and check the box for "Followers and following".' },
    { num: 11, title: 'Choose "Download to device"', desc: 'Select "Download to device" as the destination.' },
    { num: 12, title: 'Configure the download settings', desc: 'Carefully apply the mandatory download settings shown in the warning box below.' },
    { num: 13, title: 'Click "Create Files"', desc: 'Review your selection and tap the "Create files" button to submit your request to Meta.' },
    { num: 14, title: 'Wait until Instagram prepares your data', desc: 'Instagram will package your export. Because follower data contains no heavy photos, this usually takes only 2 to 10 minutes. Meta will email you when it is ready.' },
    { num: 15, title: 'Download the ZIP file', desc: 'Click the download link in the Instagram email or notification and save the .zip file to your device.' },
    { num: 16, title: 'Return to FollowBack and upload', desc: 'Come right back here to FollowBack and drag your downloaded ZIP file into the upload section below!' },
  ];

  return (
    <section id="download-instructions" className="py-12 md:py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-secondary text-xs font-bold uppercase tracking-wider mb-3">
            <Smartphone className="w-3.5 h-3.5 text-primary" />
            <span>Official Meta Export Procedure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-main tracking-tight mb-3">
            First, download your Instagram information.
          </h2>
          <p className="text-base text-secondary">
            Follow these steps to get your Instagram followers and following data safely from Meta.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((step) => (
            <React.Fragment key={step.num}>
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-primary text-white font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/20">
                  {step.num}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-main text-base sm:text-lg mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Embed the JSON Warning right after Step 12 */}
              {step.num === 12 && (
                <div className="my-6">
                  <JsonFormatWarning />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom CTA to Jump to Upload */}
        <div className="mt-12 text-center bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-main mb-2">Already have your Instagram ZIP file?</h3>
          <p className="text-sm text-secondary max-w-md mx-auto mb-6">
            If you have already downloaded your export in JSON format, you are ready to analyze!
          </p>
          <button
            onClick={onProceedToUpload}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/25 transition-all duration-200"
          >
            <span>Proceed to Upload Section</span>
            <ArrowDownCircle className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
