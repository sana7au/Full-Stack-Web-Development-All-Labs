function SettingsPage({ onlineStatus, onUpdateOnlineStatus }) {
  const isOnline = onlineStatus === 'Online';
  return (
    <section className="page-panel settings-page">
      <div className="page-heading"><div><h2>Settings</h2><p>Manage administrator availability and profile preferences.</p></div></div>
      <div className="settings-card">
        <div className="settings-avatar">AD</div>
        <div className="settings-profile-info"><h3>Administrator</h3><p>Academic Affairs · CampusHub</p><span className={`availability-pill ${isOnline ? 'online' : 'offline'}`}><span></span>{onlineStatus}</span></div>
      </div>
      <div className="settings-card status-setting-card">
        <div><h3>Availability Status</h3><p>Choose whether your administrator profile appears online or offline.</p><p className="settings-note">Your selection is saved in this browser and reflected in the profile and sidebar.</p></div>
        <div className="status-actions"><button className={`status-choice ${isOnline ? 'chosen-online' : ''}`} onClick={() => onUpdateOnlineStatus('Online')}><span className="status-choice-dot online-dot"></span>Online</button><button className={`status-choice ${!isOnline ? 'chosen-offline' : ''}`} onClick={() => onUpdateOnlineStatus('Offline')}><span className="status-choice-dot offline-dot"></span>Offline</button></div>
      </div>
    </section>
  );
}

export default SettingsPage;
