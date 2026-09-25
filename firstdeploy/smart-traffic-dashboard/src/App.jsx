import { useEffect, useState } from "react";

const trafficData = [
  {
    id: 1,
    location: "Park Street",
    traffic: "High",
    vehicles: 128,
    signal: "RED",
    timer: 42,
  },
  {
    id: 2,
    location: "Esplanade",
    traffic: "Medium",
    vehicles: 74,
    signal: "GREEN",
    timer: 28,
  },
  {
    id: 3,
    location: "Salt Lake",
    traffic: "Low",
    vehicles: 35,
    signal: "GREEN",
    timer: 50,
  },
  {
    id: 4,
    location: "Howrah Bridge",
    traffic: "High",
    vehicles: 151,
    signal: "RED",
    timer: 35,
  },
  {
    id: 5,
    location: "Gariahat",
    traffic: "Medium",
    vehicles: 82,
    signal: "YELLOW",
    timer: 8,
  },
  {
    id: 6,
    location: "New Town",
    traffic: "Low",
    vehicles: 28,
    signal: "GREEN",
    timer: 45,
  },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [signals, setSignals] = useState(trafficData);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals((currentSignals) =>
        currentSignals.map((item) => {
          if (item.timer <= 1) {
            let nextSignal = "GREEN";

            if (item.signal === "GREEN") {
              nextSignal = "YELLOW";
            } else if (item.signal === "YELLOW") {
              nextSignal = "RED";
            } else {
              nextSignal = "GREEN";
            }

            return {
              ...item,
              signal: nextSignal,
              timer:
                nextSignal === "RED"
                  ? 40
                  : nextSignal === "YELLOW"
                  ? 8
                  : 30,
            };
          }

          return {
            ...item,
            timer: item.timer - 1,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const changeSignal = (id, signal) => {
    setSignals((currentSignals) =>
      currentSignals.map((item) =>
        item.id === id
          ? {
              ...item,
              signal: signal,
              timer:
                signal === "RED"
                  ? 40
                  : signal === "YELLOW"
                  ? 8
                  : 30,
            }
          : item
      )
    );
  };

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="main-content">
        <Header
          emergencyMode={emergencyMode}
          setEmergencyMode={setEmergencyMode}
        />

        {activePage === "Dashboard" && (
          <Dashboard signals={signals} emergencyMode={emergencyMode} />
        )}

        {activePage === "Traffic Monitoring" && (
          <TrafficMonitoring signals={signals} />
        )}

        {activePage === "Signal Control" && (
          <SignalControl
            signals={signals}
            changeSignal={changeSignal}
          />
        )}

        {activePage === "Reports" && <Reports signals={signals} />}

        {activePage === "Map" && <TrafficMap signals={signals} />}
      </div>
    </div>
  );
}

/* ---------------- SIDEBAR ---------------- */

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Traffic Monitoring", icon: "🚗" },
    { name: "Signal Control", icon: "🚦" },
    { name: "Map", icon: "🗺️" },
    { name: "Reports", icon: "📈" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">🚦</div>

        <div>
          <h2>SmartTraffic</h2>
          <span>Management System</span>
        </div>
      </div>

      <nav className="navigation">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${
              activePage === item.name ? "active" : ""
            }`}
            onClick={() => setActivePage(item.name)}
          >
            <span>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="admin-box">
          <div className="admin-avatar">A</div>

          <div>
            <strong>Traffic Admin</strong>
            <small>Administrator</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---------------- HEADER ---------------- */

function Header({ emergencyMode, setEmergencyMode }) {
  return (
    <header className="top-header">
      <div>
        <p className="header-small">TRAFFIC CONTROL CENTER</p>
        <h1>City Traffic Dashboard</h1>
      </div>

      <div className="header-actions">
        <div className="system-status">
          <span className="status-dot"></span>
          System Online
        </div>

        <button
          className={`emergency-button ${
            emergencyMode ? "emergency-active" : ""
          }`}
          onClick={() => setEmergencyMode(!emergencyMode)}
        >
          🚨 {emergencyMode ? "Emergency Active" : "Emergency Mode"}
        </button>
      </div>
    </header>
  );
}

/* ---------------- DASHBOARD ---------------- */

function Dashboard({ signals, emergencyMode }) {
  const highTraffic = signals.filter(
    (item) => item.traffic === "High"
  ).length;

  const activeSignals = signals.length;

  const totalVehicles = signals.reduce(
    (total, item) => total + item.vehicles,
    0
  );

  const greenSignals = signals.filter(
    (item) => item.signal === "GREEN"
  ).length;

  return (
    <main className="page">
      {emergencyMode && (
        <div className="emergency-banner">
          🚨 Emergency Mode is currently ACTIVE. Traffic signals are
          under priority control.
        </div>
      )}

      <section className="stats-grid">
        <StatCard
          title="Active Signals"
          value={activeSignals}
          icon="🚦"
          extra="All systems operational"
        />

        <StatCard
          title="High Traffic Areas"
          value={highTraffic}
          icon="🚗"
          extra="Requires attention"
        />

        <StatCard
          title="Vehicles Detected"
          value={totalVehicles}
          icon="🚘"
          extra="Across monitored areas"
        />

        <StatCard
          title="Green Signals"
          value={greenSignals}
          icon="🟢"
          extra="Currently active"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel large-panel">
          <div className="panel-header">
            <div>
              <h2>Traffic Overview</h2>
              <p>Current traffic conditions across monitored locations</p>
            </div>

            <span className="live-badge">● LIVE</span>
          </div>

          <div className="traffic-list">
            {signals.map((item) => (
              <TrafficRow key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Signal Status</h2>
              <p>Current signal conditions</p>
            </div>
          </div>

          <div className="signal-overview">
            {signals.slice(0, 5).map((item) => (
              <div className="signal-row" key={item.id}>
                <div>
                  <strong>{item.location}</strong>
                  <span>{item.timer} seconds remaining</span>
                </div>

                <SignalLight signal={item.signal} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Traffic Level Distribution</h2>
            <p>Current traffic across all monitored locations</p>
          </div>
        </div>

        <div className="traffic-bars">
          <TrafficBar label="High Traffic" value={33} />
          <TrafficBar label="Medium Traffic" value={33} />
          <TrafficBar label="Low Traffic" value={34} />
        </div>
      </section>
    </main>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({ title, value, icon, extra }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
      </div>

      <p>{title}</p>
      <h2>{value}</h2>
      <span>{extra}</span>
    </div>
  );
}

/* ---------------- TRAFFIC ROW ---------------- */

function TrafficRow({ item }) {
  return (
    <div className="traffic-row">
      <div className="location-info">
        <div className="location-icon">📍</div>

        <div>
          <strong>{item.location}</strong>
          <span>{item.vehicles} vehicles detected</span>
        </div>
      </div>

      <span
        className={`traffic-status ${item.traffic.toLowerCase()}`}
      >
        {item.traffic}
      </span>

      <SignalLight signal={item.signal} />

      <div className="timer">
        <strong>{item.timer}s</strong>
      </div>
    </div>
  );
}

/* ---------------- SIGNAL LIGHT ---------------- */

function SignalLight({ signal }) {
  return (
    <div className="signal-light">
      <span
        className={`circle red ${
          signal === "RED" ? "on" : ""
        }`}
      ></span>

      <span
        className={`circle yellow ${
          signal === "YELLOW" ? "on" : ""
        }`}
      ></span>

      <span
        className={`circle green ${
          signal === "GREEN" ? "on" : ""
        }`}
      ></span>
    </div>
  );
}

/* ---------------- TRAFFIC BAR ---------------- */

function TrafficBar({ label, value }) {
  return (
    <div className="bar-item">
      <div className="bar-info">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>

      <div className="bar-track">
        <div
          className="bar-fill"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

/* ---------------- TRAFFIC MONITORING ---------------- */

function TrafficMonitoring({ signals }) {
  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="header-small">MONITORING</p>
          <h1>Traffic Monitoring</h1>
          <p>
            Monitor traffic conditions and vehicle activity in real
            time.
          </p>
        </div>
      </div>

      <section className="monitor-grid">
        {signals.map((item) => (
          <div className="monitor-card" key={item.id}>
            <div className="monitor-top">
              <span>📍</span>
              <span
                className={`traffic-status ${item.traffic.toLowerCase()}`}
              >
                {item.traffic}
              </span>
            </div>

            <h2>{item.location}</h2>

            <div className="monitor-details">
              <div>
                <small>Vehicles</small>
                <strong>{item.vehicles}</strong>
              </div>

              <div>
                <small>Signal</small>
                <strong>{item.signal}</strong>
              </div>

              <div>
                <small>Timer</small>
                <strong>{item.timer}s</strong>
              </div>
            </div>

            <div className="monitor-progress">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    item.vehicles / 2,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

/* ---------------- SIGNAL CONTROL ---------------- */

function SignalControl({ signals, changeSignal }) {
  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="header-small">ADMIN CONTROL</p>
          <h1>Signal Control</h1>
          <p>
            Manually control traffic signals at monitored locations.
          </p>
        </div>
      </div>

      <div className="control-grid">
        {signals.map((item) => (
          <div className="control-card" key={item.id}>
            <div className="control-header">
              <div>
                <h2>{item.location}</h2>
                <span>{item.traffic} traffic</span>
              </div>

              <SignalLight signal={item.signal} />
            </div>

            <div className="current-signal">
              Current Signal:
              <strong>{item.signal}</strong>
            </div>

            <div className="control-buttons">
              <button
                className="red-btn"
                onClick={() => changeSignal(item.id, "RED")}
              >
                🔴 Red
              </button>

              <button
                className="yellow-btn"
                onClick={() => changeSignal(item.id, "YELLOW")}
              >
                🟡 Yellow
              </button>

              <button
                className="green-btn"
                onClick={() => changeSignal(item.id, "GREEN")}
              >
                🟢 Green
              </button>
            </div>

            <div className="control-timer">
              Timer: <strong>{item.timer} seconds</strong>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

/* ---------------- MAP ---------------- */

function TrafficMap({ signals }) {
  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="header-small">LOCATION VIEW</p>
          <h1>Traffic Map</h1>
          <p>
            Visual representation of monitored traffic locations.
          </p>
        </div>
      </div>

      <div className="map-container">
        <div className="fake-map">
          <div className="road road-1"></div>
          <div className="road road-2"></div>
          <div className="road road-3"></div>
          <div className="road road-4"></div>

          {signals.map((item, index) => (
            <div
              className={`map-marker marker-${index + 1}`}
              key={item.id}
            >
              <span>📍</span>

              <div className="map-tooltip">
                <strong>{item.location}</strong>
                <small>
                  {item.traffic} traffic
                </small>
              </div>
            </div>
          ))}

          <div className="map-title">
            Kolkata Traffic Monitoring Zone
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- REPORTS ---------------- */

function Reports({ signals }) {
  const total = signals.reduce(
    (sum, item) => sum + item.vehicles,
    0
  );

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="header-small">ANALYTICS</p>
          <h1>Traffic Reports</h1>
          <p>Traffic activity and monitoring statistics.</p>
        </div>
      </div>

      <section className="report-grid">
        <div className="report-card">
          <span>Total Vehicles</span>
          <strong>{total}</strong>
          <small>Currently monitored</small>
        </div>

        <div className="report-card">
          <span>Monitored Locations</span>
          <strong>{signals.length}</strong>
          <small>Active locations</small>
        </div>

        <div className="report-card">
          <span>High Traffic</span>
          <strong>
            {signals.filter(
              (item) => item.traffic === "High"
            ).length}
          </strong>
          <small>Locations requiring attention</small>
        </div>

        <div className="report-card">
          <span>System Status</span>
          <strong>100%</strong>
          <small>Operational</small>
        </div>
      </section>

      <div className="panel report-panel">
        <div className="panel-header">
          <div>
            <h2>Location Report</h2>
            <p>Current traffic statistics by location</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Traffic</th>
                <th>Vehicles</th>
                <th>Signal</th>
                <th>Timer</th>
              </tr>
            </thead>

            <tbody>
              {signals.map((item) => (
                <tr key={item.id}>
                  <td>{item.location}</td>

                  <td>
                    <span
                      className={`traffic-status ${item.traffic.toLowerCase()}`}
                    >
                      {item.traffic}
                    </span>
                  </td>

                  <td>{item.vehicles}</td>

                  <td>{item.signal}</td>

                  <td>{item.timer}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default App;