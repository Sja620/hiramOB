import OBR, * as SDK from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3/+esm";

window.OBR = OBR;
window.SDK = SDK;

window.__hiramSyncLog = [];
OBR.onReady(() => {
  OBR.scene.items.onChange(items => {
    const mine = items.filter(i => i.name?.startsWith("hiram-"));
    window.__hiramSyncLog.push({ at: Date.now(), count: mine.length,
      latest: mine.map(i => i.lastModified).sort().pop() || null });
    if (window.__hiramSyncLog.length > 200) window.__hiramSyncLog.shift();
  });
});

window.__hiramVerify = async (name, pos) => {
  const t0 = Date.now();
  while (Date.now() - t0 < 3000) {
    const [it] = await OBR.scene.items.getItems(i => i.name === name);
    if (it && (!pos || (Math.abs(it.position.x - pos.x) < 0.5 && Math.abs(it.position.y - pos.y) < 0.5)))
      return { ok: true, waitedMs: Date.now() - t0 };
    await new Promise(r => setTimeout(r, 150));
  }
  return { ok: false, waitedMs: Date.now() - t0 };
};
