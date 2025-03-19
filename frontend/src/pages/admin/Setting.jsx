const Setting = () => {
    return (
      <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
        <h2 className="text-xl font-bold text-[#103538]">Settings</h2>
  
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-10"> {/* Added more space between sections */}
            {/* Profile Settings */}
            <Section title="Profile Settings">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Name" type="text" placeholder="Admin Name" />
                <InputField label="Email" type="email" placeholder="admin@example.com" />
              </div>
            </Section>
  
            {/* Notification Settings */}
            <Section title="Notification Settings" extraSpace>
              <div className="space-y-4"> {/* Added spacing between toggles */}
                <ToggleSwitch label="Email Notifications" defaultChecked />
                <ToggleSwitch label="SMS Notifications" />
              </div>
            </Section>
  
            {/* Security Settings */}
            <Section title="Security Settings">
              <button className="px-4 py-2 bg-[#D96851] text-white rounded-lg">
                Change Password
              </button>
            </Section>
          </div>
        </div>
      </div>
    );
  };
  
  // Reusable Section Component
  const Section = ({ title, children, extraSpace }) => (
    <div className={`pb-6 ${extraSpace ? "mt-4" : ""}`}> {/* Added margin to increase spacing */}
      <h3 className="text-lg font-semibold text-[#103538] mb-6">{title}</h3> {/* Increased margin below title */}
      {children}
    </div>
  );
  
  // Reusable Input Field Component
  const InputField = ({ label, type, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-[#759B87] mb-2">{label}</label>
      <input
        type={type}
        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#D8B258]"
        placeholder={placeholder}
      />
    </div>
  );
  
  // Reusable Toggle Switch Component
  const ToggleSwitch = ({ label, defaultChecked }) => (
    <div className="flex items-center justify-between">
      <span className="text-[#103538]">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div
          className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full 
          peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
          after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D96851]"
        ></div>
      </label>
    </div>
  );
  
  export default Setting;
  