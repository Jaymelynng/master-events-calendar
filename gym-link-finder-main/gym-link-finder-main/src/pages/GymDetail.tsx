import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, MapPin, Phone, Mail, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const GymDetail = () => {
  const { id } = useParams();

  const { data: gym, isLoading: gymLoading } = useQuery({
    queryKey: ["gym", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gyms")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: gymLinks, isLoading: linksLoading } = useQuery({
    queryKey: ["gym-links", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gym_links")
        .select(`
          *,
          link_types!inner(*)
        `)
        .eq("gym_id", id)
        .eq("is_active", true)
        .order("link_types.sort_order");
      
      if (error) throw error;
      return data;
    },
  });

  if (gymLoading || linksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Gym Not Found</h1>
          <p className="text-gray-600 mb-6">The gym you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Database
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const linksByCategory = gymLinks?.reduce((acc, link) => {
    const category = link.link_types.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(link);
    return acc;
  }, {} as Record<string, any[]>) || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Database
            </Button>
          </Link>
        </div>

        {/* Gym Info Card */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold text-gym-primary mb-2">
                  {gym.name}
                </CardTitle>
                {gym.manager && (
                  <p className="text-lg text-gray-600 mb-2">
                    Manager: {gym.manager}
                  </p>
                )}
                {gym.description && (
                  <p className="text-gray-700">{gym.description}</p>
                )}
              </div>
              {gym.logo_url && (
                <img 
                  src={gym.logo_url} 
                  alt={`${gym.name} logo`}
                  className="w-24 h-24 object-contain rounded-lg ml-4"
                />
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gym.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gym-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">{gym.address}</p>
                    {gym.city && gym.state && (
                      <p className="text-gray-600">{gym.city}, {gym.state}</p>
                    )}
                  </div>
                </div>
              )}

              {gym.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gym-primary" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <a href={`tel:${gym.phone}`} className="text-gym-primary hover:underline">
                      {gym.phone}
                    </a>
                  </div>
                </div>
              )}

              {gym.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gym-primary" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <a href={`mailto:${gym.email}`} className="text-gym-primary hover:underline">
                      {gym.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Programs & Specialties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gym.programs && gym.programs.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Programs
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {gym.programs.map((program: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {program}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {gym.age_groups && gym.age_groups.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Age Groups</h3>
                  <div className="flex flex-wrap gap-2">
                    {gym.age_groups.map((age: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {age}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        {Object.keys(linksByCategory).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(linksByCategory).map(([category, links]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-lg text-gray-900 mb-3 capitalize">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {links.map((link) => (
                        <Button
                          key={link.id}
                          asChild
                          variant="outline"
                          className="justify-start h-auto p-4"
                        >
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <span className="mr-2">{link.link_types.emoji}</span>
                            <div className="text-left">
                              <div className="font-medium">{link.link_types.label}</div>
                              {link.notes && (
                                <div className="text-sm text-gray-500">{link.notes}</div>
                              )}
                            </div>
                            <ExternalLink className="w-4 h-4 ml-auto" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GymDetail;