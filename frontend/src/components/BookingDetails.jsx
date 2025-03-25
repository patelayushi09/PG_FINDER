import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MapPin, Phone, Clock, CreditCard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function BookingDetails({ bookingId }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tenant/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBooking(response.data.data);
        setNotes(response.data.data.notes || "");
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId && token) fetchBookingDetails();
  }, [bookingId, token]);

  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.patch(
        `http://localhost:5000/tenant/bookings/${bookingId}/status`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBooking({ ...booking, status: "cancelled" });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking");
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);

    try {
      await axios.patch(
        `http://localhost:5000/tenant/bookings/${bookingId}/notes`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBooking({ ...booking, notes });
      alert("Notes saved successfully");
    } catch (error) {
      console.error("Error saving notes:", error);
      alert("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading booking details...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!booking) return <div className="text-center py-8">Booking not found</div>;

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-700",
      upcoming: "bg-blue-100 text-blue-700",
      completed: "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-700",
      pending: "bg-yellow-100 text-yellow-700",
    };
    return colors[status.toLowerCase()] || "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Booking Details</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{booking.propertyName}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {booking.location}
                  </CardDescription>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={booking.propertyImage || "/placeholder.svg"}
                alt={booking.propertyName}
                className="w-full h-48 object-cover rounded-lg"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Check-in</div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-[#D8B258]" />
                    {formatDate(booking.checkIn)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Check-out</div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-[#D8B258]" />
                    {formatDate(booking.checkOut)}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Total: ${booking.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Status: {booking.paymentStatus}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Notes</h3>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes..." rows={4} />
                <Button onClick={handleSaveNotes} disabled={savingNotes || notes === booking.notes} className="mt-2" size="sm">
                  {savingNotes ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              {booking.status !== "cancelled" && booking.status !== "completed" && (
                <Button variant="destructive" onClick={handleCancelBooking}>
                  Cancel Booking
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Landlord Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {booking.landlordName?.charAt(0) || "L"}
                </div>
                <div>
                  <div className="font-medium">{booking.landlordName}</div>
                  <div className="text-sm text-gray-500">Property Owner</div>
                </div>
              </div>

              <Button variant="outline" className="w-full justify-start" onClick={() => (window.location.href = `tel:${booking.landlordPhone}`)}>
                <Phone className="w-4 h-4 mr-2" />
                {booking.landlordPhone}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
