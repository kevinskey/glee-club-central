import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { UpcomingEventsList } from "@/components/calendar/UpcomingEventsList";
import { Calendar, Music, Bell, User, Video, Heart, Download, ShoppingBag, Mail, Star, FileText, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function FanDashboardPage() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock supporter tier
  const supporterTier = "Silver";
  
  // Mock donation history
  const donationHistory = [
    { id: "don-1", date: "May 15, 2025", amount: "$100.00", type: "One-time" },
    { id: "don-2", date: "Jan 10, 2025", amount: "$50.00", type: "One-time" }
  ];
  
  // Mock exclusive content
  const exclusiveContent = [
    { id: "vid-1", title: "Spring Concert Behind the Scenes", type: "video", date: "May 20, 2025", thumbnail: "/assets/thumbnail1.jpg" },
    { id: "int-1", title: "Interview with the Director", type: "video", date: "Apr 12, 2025", thumbnail: "/assets/thumbnail2.jpg" },
    { id: "aud-1", title: "Exclusive Recording: Ave Maria", type: "audio", date: "Mar 30, 2025" }
  ];
  
  // Mock merchandise
  const merchandise = [
    { id: "merch-1", name: "Glee Club T-Shirt", price: "$25.00", image: "/assets/tshirt.jpg" },
    { id: "merch-2", name: "Commemorative CD", price: "$15.00", image: "/assets/cd.jpg" }
  ];
  
  // Fan dashboard quick access tiles
  const fanTiles = [
    {
      title: "Calendar",
      icon: <Calendar className="h-5 w-5 text-white" />,
      href: "/dashboard/calendar",
      color: "bg-gradient-to-br from-blue-500 to-blue-700"
    },
    {
      title: "Announcements",
      icon: <Bell className="h-5 w-5 text-white" />,
      href: "/dashboard/announcements",
      color: "bg-gradient-to-br from-amber-500 to-amber-700"
    },
    {
      title: "My Profile",
      icon: <User className="h-5 w-5 text-white" />,
      href: "/dashboard/profile",
      color: "bg-gradient-to-br from-purple-500 to-purple-700"
    },
    {
      title: "Glee Store",
      icon: <ShoppingBag className="h-5 w-5 text-white" />,
      href: "/dashboard/store",
      color: "bg-gradient-to-br from-green-500 to-green-700"
    },
  ];

  const getTierColor = (tier) => {
    switch(tier) {
      case "Gold": return "bg-amber-500 text-white";
      case "Silver": return "bg-slate-400 text-white";
      case "Platinum": return "bg-indigo-700 text-white";
      default: return "bg-blue-600 text-white";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome to the Supporter Lounge, ${profile?.first_name || 'Fan'}`}
        description="Your exclusive Spelman College Glee Club fan dashboard"
      />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Exclusive Content</TabsTrigger>
          <TabsTrigger value="donate">Donations</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <Card className="flex-1 md:max-w-xs">
              <CardHeader className="pb-2">
                <CardTitle>Fan Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.first_name || "Fan"} />
                  <AvatarFallback>{profile?.first_name?.charAt(0) || "F"}{profile?.last_name?.charAt(0) || ""}</AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-lg">{profile?.first_name} {profile?.last_name}</h3>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
                <div className="mt-3">
                  <Badge className={getTierColor(supporterTier)}>
                    {supporterTier} Supporter
                  </Badge>
                </div>
                <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => navigate('/dashboard/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Upcoming Glee Club Events</CardTitle>
              </CardHeader>
              <CardContent>
                <UpcomingEventsList 
                  eventType="concert"
                  limit={3}
                />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard/calendar')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  View Full Calendar
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Latest Exclusive Content</CardTitle>
                <CardDescription>Special content for {supporterTier} supporters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {exclusiveContent.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 border rounded-md hover:bg-muted/50 cursor-pointer">
                    <div className="bg-primary/20 p-2 rounded-md">
                      {item.type === "video" ? (
                        <Video className="h-5 w-5 text-primary" />
                      ) : (
                        <Music className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("content")}>
                  View All Exclusive Content
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>News & Updates</CardTitle>
                <CardDescription>Stay informed about the Glee Club</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium text-sm">Spring Tour Announced!</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    The Spelman College Glee Club announces its annual Spring Tour. Cities and dates to be announced soon.
                  </p>
                  <p className="text-xs mt-2">May 1, 2025</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium text-sm">Holiday Concert Recording Available</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Exclusive to Silver tier and above: Full recording of our Holiday Concert now available.
                  </p>
                  <p className="text-xs mt-2">April 15, 2025</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard/announcements')}>
                  <Bell className="mr-2 h-4 w-4" />
                  View All Announcements
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Preferences</CardTitle>
                <CardDescription>Manage your email subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Glee Club Announcements</label>
                      <p className="text-xs text-muted-foreground">
                        Performances, tours, and major events
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Exclusive Content Alerts</label>
                      <p className="text-xs text-muted-foreground">
                        New videos, recordings, and member interviews
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Fundraising Campaigns</label>
                      <p className="text-xs text-muted-foreground">
                        Donation opportunities and fundraising events
                      </p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => navigate('/dashboard/newsletter')}>
                  <Mail className="mr-2 h-4 w-4" />
                  Update Email Preferences
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Exclusive Content Tab */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Exclusive Content</CardTitle>
              <CardDescription>Special media for {supporterTier} tier supporters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exclusiveContent.map((item) => (
                  <Card key={item.id}>
                    <div className="aspect-video bg-muted relative overflow-hidden rounded-t-md">
                      {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="object-cover w-full h-full" />}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        {item.type === "video" ? (
                          <Video className="h-12 w-12 text-white" />
                        ) : (
                          <Music className="h-12 w-12 text-white" />
                        )}
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </CardContent>
                    <CardFooter className="p-3 pt-0">
                      <Button variant="secondary" size="sm" className="w-full">
                        {item.type === "video" ? "Watch Now" : "Listen Now"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-md text-center">
                <h3 className="text-lg font-medium">Upgrade to Gold Tier</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Get access to 10+ more exclusive videos and interviews with Glee Club members.
                </p>
                <Button>
                  <Star className="mr-2 h-4 w-4" />
                  Upgrade Your Support
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Downloadable Resources</CardTitle>
              <CardDescription>Programs, posters and more</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-medium">Spring Concert Program</h4>
                      <p className="text-xs text-muted-foreground">PDF, 2.4MB</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-medium">Tour Poster</h4>
                      <p className="text-xs text-muted-foreground">JPEG, 1.8MB</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Donations Tab */}
        <TabsContent value="donate">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Support the Glee Club</CardTitle>
                <CardDescription>Your donations make a difference</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 cursor-pointer hover:bg-muted/50">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold">$25</h3>
                        <p className="text-sm text-muted-foreground">One-time</p>
                      </div>
                    </Card>
                    <Card className="p-4 cursor-pointer border-2 border-primary">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold">$50</h3>
                        <p className="text-sm text-muted-foreground">One-time</p>
                      </div>
                    </Card>
                    <Card className="p-4 cursor-pointer hover:bg-muted/50">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold">$100</h3>
                        <p className="text-sm text-muted-foreground">One-time</p>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium mb-2">Custom Amount</label>
                    <div className="flex">
                      <div className="flex-shrink-0 rounded-l-md bg-muted flex items-center px-3 border border-r-0">
                        <span className="text-sm text-muted-foreground">$</span>
                      </div>
                      <input 
                        type="number" 
                        placeholder="Other amount"
                        className="flex-1 rounded-r-md border focus:ring-2 focus:ring-primary focus:outline-none p-2"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium mb-2">Donation Frequency</label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="border-2 border-primary">One-time</Button>
                      <Button variant="outline">Monthly</Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium mb-2">Donation Purpose (Optional)</label>
                    <select className="w-full border rounded-md p-2">
                      <option value="">General Support</option>
                      <option value="tour">Tour Fund</option>
                      <option value="scholarship">Scholarship Fund</option>
                      <option value="equipment">Equipment Fund</option>
                    </select>
                  </div>
                  
                  <Button className="w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    Make Donation
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    All donations are tax-deductible to the extent allowed by law.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Donation History</CardTitle>
                </CardHeader>
                <CardContent>
                  {donationHistory.length ? (
                    <div className="space-y-2">
                      {donationHistory.map((donation) => (
                        <div key={donation.id} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="text-sm font-medium">{donation.amount}</p>
                            <p className="text-xs text-muted-foreground">{donation.date}</p>
                          </div>
                          <Badge variant="outline">{donation.type}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-center text-muted-foreground">No donation history yet.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Tax Receipts
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Support Tiers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Free</h3>
                      <Badge variant="outline">Current</Badge>
                    </div>
                    <ul className="text-xs space-y-1 list-disc pl-4">
                      <li>Public event calendar</li>
                      <li>Basic announcements</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-md border-2 border-primary">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Silver</h3>
                      <Badge className={getTierColor("Silver")}>Current</Badge>
                    </div>
                    <ul className="text-xs space-y-1 list-disc pl-4">
                      <li>All Free tier benefits</li>
                      <li>Access to select recordings</li>
                      <li>Monthly newsletter</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-md border-dashed">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Gold</h3>
                      <Button size="sm" variant="secondary">Upgrade</Button>
                    </div>
                    <ul className="text-xs space-y-1 list-disc pl-4">
                      <li>All Silver tier benefits</li>
                      <li>Exclusive videos and interviews</li>
                      <li>Early concert access</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Store Tab */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Glee Club Store</CardTitle>
              <CardDescription>Official Spelman College Glee Club merchandise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {merchandise.map((item) => (
                  <Card key={item.id}>
                    <div className="aspect-square bg-muted rounded-t-md overflow-hidden">
                      {item.image && <img src={item.image} alt={item.name} className="object-cover w-full h-full" />}
                    </div>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{item.name}</h3>
                        <span className="font-medium">{item.price}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 pt-0">
                      <Button variant="secondary" className="w-full">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                <Card>
                  <div className="aspect-square bg-muted rounded-t-md flex items-center justify-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <CardContent className="p-3 text-center">
                    <h3 className="font-medium">More Products Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">Check back for new merchandise</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
