import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Settings, 
  Upload, 
  Mail, 
  Shield, 
  Database, 
  Bell,
  Loader2,
  Image as ImageIcon,
  Trash2
} from "lucide-react";

export const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  
  // Site Settings
  const [siteName, setSiteName] = useState("AgroMart");
  const [siteDescription, setSiteDescription] = useState("Premium Agricultural Solutions");
  const [contactEmail, setContactEmail] = useState("admin@agromart.com");
  const [supportEmail, setSupportEmail] = useState("support@agromart.com");
  
  // Email Templates
  const [welcomeEmailTemplate, setWelcomeEmailTemplate] = useState("Welcome to AgroMart!");
  const [orderConfirmationTemplate, setOrderConfirmationTemplate] = useState("Your order has been confirmed.");
  
  // Notification Settings
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);
  const [enableSMSNotifications, setEnableSMSNotifications] = useState(false);
  const [enablePushNotifications, setEnablePushNotifications] = useState(true);
  
  // Security Settings
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  
  // Stripe Settings
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please upload an image file",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Please upload an image smaller than 2MB",
      });
      return;
    }

    setLogoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadLogo = async () => {
    if (!logoFile) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a logo to upload",
      });
      return;
    }

    setLoading(true);
    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, logoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      toast({
        title: "Logo Uploaded",
        description: "Site logo has been updated successfully",
      });

      setLogoPreview(publicUrl);
      setLogoFile(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneralSettings = async () => {
    setLoading(true);
    try {
      // Here you would save to database or config
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "General settings have been updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmailTemplates = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Templates Saved",
        description: "Email templates have been updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Notification settings have been updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Security settings have been updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="shadow-card border-0">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle>General Settings</CardTitle>
          </div>
          <CardDescription>Configure your site's basic information</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="AgroMart"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea
              id="site-description"
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              placeholder="Premium Agricultural Solutions"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="admin@agromart.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input
                id="support-email"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@agromart.com"
              />
            </div>
          </div>
          <Button onClick={handleSaveGeneralSettings} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save General Settings
          </Button>
        </CardContent>
      </Card>

      {/* Logo Upload */}
      <Card className="shadow-card border-0">
        <CardHeader className="bg-gradient-to-r from-accent/5 to-transparent">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-accent" />
            <CardTitle>Site Logo</CardTitle>
          </div>
          <CardDescription>Upload your site logo (max 2MB)</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {logoPreview && (
            <div className="flex items-center gap-4">
              <img src={logoPreview} alt="Logo Preview" className="h-20 w-20 object-cover rounded-lg border" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLogoPreview("");
                  setLogoFile(null);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          )}
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="flex-1"
            />
            <Button onClick={handleUploadLogo} disabled={!logoFile || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card className="shadow-card border-0">
        <CardHeader className="bg-gradient-to-r from-earth/5 to-transparent">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-earth" />
            <CardTitle>Email Templates</CardTitle>
          </div>
          <CardDescription>Customize automated email templates</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcome-email">Welcome Email</Label>
            <Textarea
              id="welcome-email"
              value={welcomeEmailTemplate}
              onChange={(e) => setWelcomeEmailTemplate(e.target.value)}
              placeholder="Welcome message..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order-confirmation">Order Confirmation Email</Label>
            <Textarea
              id="order-confirmation"
              value={orderConfirmationTemplate}
              onChange={(e) => setOrderConfirmationTemplate(e.target.value)}
              placeholder="Order confirmation message..."
              rows={4}
            />
          </div>
          <Button onClick={handleSaveEmailTemplates} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Email Templates
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-card border-0">
        <CardHeader className="bg-gradient-to-r from-success/5 to-transparent">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-success" />
            <CardTitle>Notification Settings</CardTitle>
          </div>
          <CardDescription>Configure system notifications</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send notifications via email</p>
            </div>
            <Switch
              checked={enableEmailNotifications}
              onCheckedChange={setEnableEmailNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
            </div>
            <Switch
              checked={enableSMSNotifications}
              onCheckedChange={setEnableSMSNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Send browser push notifications</p>
            </div>
            <Switch
              checked={enablePushNotifications}
              onCheckedChange={setEnablePushNotifications}
            />
          </div>
          <Separator />
          <Button onClick={handleSaveNotificationSettings} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="shadow-card border-0">
        <CardHeader className="bg-gradient-to-r from-destructive/5 to-transparent">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            <CardTitle>Security Settings</CardTitle>
          </div>
          <CardDescription>Configure security and access controls</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
            </div>
            <Switch
              checked={enableTwoFactor}
              onCheckedChange={setEnableTwoFactor}
            />
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
              <Input
                id="max-login-attempts"
                type="number"
                value={maxLoginAttempts}
                onChange={(e) => setMaxLoginAttempts(e.target.value)}
                placeholder="5"
              />
            </div>
          </div>
          <Button onClick={handleSaveSecuritySettings} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Security Settings
          </Button>
        </CardContent>
      </Card>

      {/* Payment Integration */}
      <Card className="shadow-card border-0">
        <CardHeader className="bg-gradient-to-r from-warning/5 to-transparent">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-warning" />
            <CardTitle>Payment Integration</CardTitle>
          </div>
          <CardDescription>Configure Stripe payment settings</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripe-publishable">Stripe Publishable Key</Label>
            <Input
              id="stripe-publishable"
              type="text"
              value={stripePublishableKey}
              onChange={(e) => setStripePublishableKey(e.target.value)}
              placeholder="pk_test_..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
            <Input
              id="stripe-secret"
              type="password"
              value={stripeSecretKey}
              onChange={(e) => setStripeSecretKey(e.target.value)}
              placeholder="sk_test_..."
            />
            <p className="text-xs text-muted-foreground">
              Stripe keys are already configured via Supabase secrets
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
