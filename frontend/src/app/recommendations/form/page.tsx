import { redirect } from "next/navigation"
import { Metadata } from "next";
import { ArrowLeft, Shield, FileCheck, Users, Home, Car, Briefcase, Heart } from "lucide-react";
import Link from "next/link";
import RecommendationForm from "@/components/recommendation-form";
export const metadata: Metadata = {
  title: "Detailed Insurance Assessment | Financial Protection Analysis",
  description: "Complete a comprehensive insurance needs assessment for personalized recommendations",
};

export default async function DetailedFormPage() {
  const session = true

  if (!session) {
    redirect("/")
  }

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      <div className="container mx-auto max-w-4xl py-10 px-4 sm:px-6">
        <nav className="mb-8">
          <Link href="/recommendations" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Insurance Hub
          </Link>
        </nav>

        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-3 text-gray-900">Complete Insurance Assessment</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Answer the following questions to receive a comprehensive analysis of your insurance needs and personalized recommendations.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-xl font-semibold text-white">Your Personal Insurance Profile</h2>
            <p className="text-indigo-100 text-sm mt-1">
              All information is kept confidential and used only to generate your recommendations
            </p>
          </div>
          
          <div className="p-6">
              <RecommendationForm />          </div>
        </div>

        {/* Coverage Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Coverage Types We'll Analyze</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Users className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Life Insurance</h3>
                <p className="text-sm text-gray-600">Protecting your family's financial future</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <Heart className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Health Insurance</h3>
                <p className="text-sm text-gray-600">Coverage for medical expenses and wellness</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-start">
              <div className="bg-amber-100 p-2 rounded-lg mr-3">
                <Home className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Home Insurance</h3>
                <p className="text-sm text-gray-600">Protecting your property and belongings</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-start">
              <div className="bg-red-100 p-2 rounded-lg mr-3">
                <Car className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Auto Insurance</h3>
                <p className="text-sm text-gray-600">Vehicle protection and liability coverage</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-start">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <Briefcase className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Disability Insurance</h3>
                <p className="text-sm text-gray-600">Income protection if you can't work</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-start">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <Shield className="h-5 w-5 text-indigo-700" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Liability Insurance</h3>
                <p className="text-sm text-gray-600">Protection against legal claims</p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Explanation */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-10">
          <h2 className="text-xl font-bold mb-4 text-gray-800">How Your Assessment Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <span className="text-indigo-700 font-bold">1</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">Complete Profile</h3>
              <p className="text-sm text-gray-600">Answer questions about your life, assets, and financial situation</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <span className="text-indigo-700 font-bold">2</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">AI Analysis</h3>
              <p className="text-sm text-gray-600">Our system evaluates your unique risk profile and needs</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <span className="text-indigo-700 font-bold">3</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">Get Recommendations</h3>
              <p className="text-sm text-gray-600">Receive tailored insurance suggestions and coverage estimates</p>
            </div>
          </div>
        </div>
        
        {/* Privacy Note */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 flex items-center justify-center">
          <div className="bg-gray-100 p-2 rounded-full mr-3">
            <FileCheck className="h-4 w-4 text-gray-700" />
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Privacy Guaranteed:</span> Your information is secure and never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  )
}