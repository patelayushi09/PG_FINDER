import { useState } from "react"
import Messages from "../pages/tenants/Messages"
import MessageBox from "../pages/landlord/MessageBox"

export default function MessageSystem({ tenantId, landlordId }) {
  const [userType, setUserType] = useState("tenant")

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#103538]">Property Management Messaging System</h1>
        <div className="space-x-2">
          <button
            onClick={() => setUserType("tenant")}
            className={`px-4 py-2 rounded ${userType === "tenant" ? "bg-[#103538] text-white" : "border border-[#103538] text-[#103538]"}`}
          >
            Tenant View
          </button>
          <button
            onClick={() => setUserType("landlord")}
            className={`px-4 py-2 rounded ${userType === "landlord" ? "bg-[#103538] text-white" : "border border-[#103538] text-[#103538]"}`}
          >
            Landlord View
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        {userType === "tenant" ? (
          <Messages tenantId={tenantId} />
        ) : (
          <MessageBox landlordId={landlordId} />
        )}
      </div>
    </div>
  )
}