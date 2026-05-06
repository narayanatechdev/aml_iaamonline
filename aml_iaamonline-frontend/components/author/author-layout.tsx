"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, MapPin, Building, ExternalLink, Calendar } from "lucide-react";

interface AuthorLayoutProps {
  author: {
    id: string;
    name: string;
    email?: string;
    affiliation?: string;
    department?: string;
    location?: string;
    orcid?: string;
    bio?: string;
    profileImage?: string;
    joinedDate?: string;
    publicationsCount?: number;
    citationsCount?: number;
    hIndex?: number;
    areas?: string[];
  };
}

export default function AuthorLayout({ author }: AuthorLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Author Profile Card */}
        <div className="lg:col-span-1">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#0f2d6b]/10 flex items-center justify-center">
                  {author.profileImage ? (
                    <img 
                      src={author.profileImage} 
                      alt={author.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-[#0f2d6b]" />
                  )}
                </div>
                <h1 className="text-[#0f2d6b] text-xl mb-2" style={{ fontWeight: 700 }}>
                  {author.name}
                </h1>
                {author.affiliation && (
                  <p className="text-[#5a6a8a] text-sm mb-2">{author.affiliation}</p>
                )}
                {author.department && (
                  <p className="text-[#7a8aa8] text-xs">{author.department}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-3 mb-6">
                {author.email && (
                  <div className="flex items-center gap-3 text-sm text-[#3a4a6a]">
                    <Mail className="w-4 h-4 text-[#5a6a8a]" />
                    <span>{author.email}</span>
                  </div>
                )}
                {author.location && (
                  <div className="flex items-center gap-3 text-sm text-[#3a4a6a]">
                    <MapPin className="w-4 h-4 text-[#5a6a8a]" />
                    <span>{author.location}</span>
                  </div>
                )}
                {author.orcid && (
                  <div className="flex items-center gap-3 text-sm text-[#3a4a6a]">
                    <ExternalLink className="w-4 h-4 text-[#5a6a8a]" />
                    <a 
                      href={`https://orcid.org/${author.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0f2d6b] hover:underline"
                    >
                      ORCID: {author.orcid}
                    </a>
                  </div>
                )}
                {author.joinedDate && (
                  <div className="flex items-center gap-3 text-sm text-[#3a4a6a]">
                    <Calendar className="w-4 h-4 text-[#5a6a8a]" />
                    <span>Member since {author.joinedDate}</span>
                  </div>
                )}
              </div>

              {/* Research Areas */}
              {author.areas && author.areas.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 600 }}>
                    Research Areas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {author.areas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {author.bio && (
                <div>
                  <h3 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 600 }}>
                    Biography
                  </h3>
                  <p className="text-[#3a4a6a] text-sm leading-relaxed">{author.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Publication Metrics */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-[#0f2d6b] to-[#1a3f8f] text-white">
              <CardContent className="p-5 text-center">
                <div className="text-2xl mb-1" style={{ fontWeight: 700 }}>
                  {author.publicationsCount || 0}
                </div>
                <div className="text-xs opacity-90">Publications</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-[#c9a227] to-[#b8911f] text-white">
              <CardContent className="p-5 text-center">
                <div className="text-2xl mb-1" style={{ fontWeight: 700 }}>
                  {author.citationsCount || 0}
                </div>
                <div className="text-xs opacity-90">Citations</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
              <CardContent className="p-5 text-center">
                <div className="text-2xl mb-1" style={{ fontWeight: 700 }}>
                  {author.hIndex || 0}
                </div>
                <div className="text-xs opacity-90">H-Index</div>
              </CardContent>
            </Card>
          </div>

          {/* Publications Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-[#0f2d6b] text-lg">Recent Publications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[#5a6a8a] text-sm text-center py-8">
                Publications will be loaded dynamically
              </div>
            </CardContent>
          </Card>

          {/* Activity Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0f2d6b] text-lg">Editorial Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[#5a6a8a] text-sm text-center py-8">
                Editorial activities and review history will be displayed here
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}