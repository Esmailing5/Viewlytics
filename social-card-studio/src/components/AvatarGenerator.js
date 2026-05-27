import { store } from '../state/store.js';

export function renderAvatarGenerator() {
  return `
    <div class="avatar-gen-preview" id="avatar-gen-preview" style="width: 1080px; height: 1080px; background: radial-gradient(circle at center, #161b22 0%, #0b0e14 100%); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.08);">
      
      <!-- Ambient Glow Backgrounds -->
      <div style="position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(0, 114, 255, 0.15) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 1;"></div>
      <div style="position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(0, 198, 255, 0.1) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 1;"></div>
      
      <!-- Watermark subtle details -->
      <div style="position: absolute; inset: 0; opacity: 0.03; background-image: url('data:image/svg+xml;utf8,<svg viewBox=&quot;0 0 200 200&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><filter id=&quot;noiseFilter&quot;><feTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.8&quot; numOctaves=&quot;3&quot; stitchTiles=&quot;stitch&quot;/></filter><rect width=&quot;100%&quot; height=&quot;100%&quot; filter=&quot;url(%23noiseFilter)&quot;/></svg>'); pointer-events: none; z-index: 1; mix-blend-mode: overlay;"></div>

      <!-- Exact Vector Logo Icon -->
      <div style="z-index: 5; display: flex; flex-direction: column; align-items: center; gap: 40px; text-align: center;">
        <div style="position: relative; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 35px rgba(0, 198, 255, 0.35)) drop-shadow(0 20px 40px rgba(0,0,0,0.6));">
          <svg style="width: 320px; height: auto;" viewBox="0 -5 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2 L15 32 C18 38 25 40 30 35 L50 15" stroke="#0072ff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M30 35 L60 5 L45 5 M60 5 L60 20" stroke="#00c6ff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <circle cx="20" cy="25" r="4.5" fill="#00c6ff" />
          </svg>
        </div>
      </div>
    </div>
  `;
}

export function initAvatarGenerator() {
  // Empty init since there are no user state controls, it's a pure high-res generator.
}
