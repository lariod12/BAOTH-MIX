function createStatusBadge() {
  const badge = document.createElement("span");
  badge.className = "status-badge status-idle";
  badge.textContent = "Disconnected";
  return badge;
}

export function createHomeView(socket) {
  const shell = document.createElement("main");
  shell.className = "mobile-shell";

  const card = document.createElement("section");
  card.className = "mobile-card";

  const title = document.createElement("h1");
  title.className = "screen-title";
  title.textContent = "Betrayal Mobile Hub";

  const subtitle = document.createElement("p");
  subtitle.className = "screen-subtitle";
  subtitle.textContent = "Vanilla JavaScript + Socket.IO starter for mobile-first UI.";

  const statusRow = document.createElement("div");
  statusRow.className = "status-row";
  statusRow.innerHTML = '<span class="status-label">Socket status</span>';
  const statusBadge = createStatusBadge();
  statusRow.appendChild(statusBadge);

  const connectButton = document.createElement("button");
  connectButton.type = "button";
  connectButton.className = "btn-primary";
  connectButton.textContent = "Connect Socket";

  connectButton.addEventListener("click", () => {
    if (socket.connected) {
      socket.disconnect();
      return;
    }

    socket.connect();
  });

  socket.on("connect", () => {
    statusBadge.className = "status-badge status-online";
    statusBadge.textContent = "Connected";
    connectButton.textContent = "Disconnect Socket";
  });

  socket.on("disconnect", () => {
    statusBadge.className = "status-badge status-idle";
    statusBadge.textContent = "Disconnected";
    connectButton.textContent = "Connect Socket";
  });

  card.append(title, subtitle, statusRow, connectButton);
  shell.appendChild(card);
  return shell;
}
