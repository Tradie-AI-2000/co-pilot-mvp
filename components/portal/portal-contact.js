"use client";

import { Phone, Mail, MapPin } from "lucide-react";

export default function PortalContact() {
    return (
        <div className="max-w-2xl mx-auto py-10 px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Your Stellar Team</h2>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative overflow-hidden group hover:border-secondary transition-colors">
                <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>

                <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 border-2 border-slate-700 flex items-center justify-center text-3xl font-bold text-secondary">
                    JW
                </div>

                <h3 className="text-2xl font-bold text-white">Joe Ward</h3>
                <p className="text-secondary font-medium mb-6">Senior Recruitment Consultant</p>

                <div className="space-y-4 text-left max-w-sm mx-auto">
                    <div className="flex items-center gap-4 text-slate-300 bg-slate-800/50 p-3 rounded-lg">
                        <Phone className="text-secondary" /> <span>021 123 4567</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300 bg-slate-800/50 p-3 rounded-lg">
                        <Mail className="text-secondary" /> <span>joe.ward@stellarrecruitment.co.nz</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300 bg-slate-800/50 p-3 rounded-lg">
                        <MapPin className="text-secondary" /> <span>Level 1, 123 Queen St, Auckland</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-slate-500 text-sm">
                Need urgent assistance? Call our 24/7 Support Line: <strong>0800 STELLAR</strong>
            </div>
        </div>
    );
}
