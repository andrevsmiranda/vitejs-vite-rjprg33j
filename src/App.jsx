import { useState, useEffect } from "react";

// ─── BRAND TOKENS ───────────────────────────────────────────────
const B = {
  azul:    "#2F3855",
  azulMid: "#3d4f6e",
  azulLight:"#4a5f82",
  verde:   "#57A68C",
  verdeLight:"#6dbfa3",
  vermelho:"#FF4546",
  amarelo: "#F7B846",
  bege:    "#F3EEE8",
  begeDeep:"#e8dfd4",
  branco:  "#FFFFFF",
  texto:   "#2F3855",
  textoClaro: "#F3EEE8",
};

// ─── DATA ────────────────────────────────────────────────────────
const AREAS = ["Quarto 101","Quarto 102","Quarto 103","Quarto 104","Quarto 105","Quarto 201","Quarto 202","Quarto 203","Quarto 204","Quarto 205","Piscina","Restaurante","Recepção","Academia","Spa","Área de Lazer","Estacionamento","Jardins","Cozinha","Lavanderia"];
const CATEGORIAS = ["Elétrica","Hidráulica","Ar-condicionado","Mobiliário","Limpeza especial","Pintura","Estrutural","Equipamentos","Jardinagem","Outro"];
const PRIORIDADES = ["Baixa","Média","Alta","Urgente"];
const SOLICITANTES = ["Recepção","Camareira","Gerência"];

const prioColor = { Baixa: B.verde, Média: B.amarelo, Alta: "#f5924a", Urgente: B.vermelho };
const prioIcon  = { Baixa:"🟢", Média:"🟡", Alta:"🟠", Urgente:"🔴" };
const statusBadge = { "Aberto": B.azulLight, "Em andamento": B.amarelo, "Concluído": B.verde, "Paliativo": B.vermelho };

const PERFIL_ICON = { Recepção:"🛎️", Camareira:"🛏️", Gerência:"👔", Manutenção:"🔧" };
const PERFIL_DESC = { Recepção:"Abrir e acompanhar chamados", Camareira:"Reportar problemas nos quartos", Gerência:"Visão completa e relatórios", Manutenção:"Executar e atualizar OS" };

const INITIAL_OS = [
  { id:1, area:"Quarto 102", categoria:"Ar-condicionado", descricao:"Ar-condicionado não está gelando, hóspede reclamou duas vezes.", prioridade:"Alta", solicitante:"Recepção", status:"Em andamento", responsavel:"Carlos", dataCriacao:"2025-03-10T08:30:00", dataAtualizacao:"2025-03-10T09:15:00", observacoes:"Verificado filtro, precisa trocar gás.", solucao:"", recorrente:true },
  { id:2, area:"Piscina", categoria:"Hidráulica", descricao:"Vazamento na bomba de recirculação da piscina.", prioridade:"Urgente", solicitante:"Gerência", status:"Aberto", responsavel:"", dataCriacao:"2025-03-10T10:00:00", dataAtualizacao:"2025-03-10T10:00:00", observacoes:"", solucao:"", recorrente:false },
  { id:3, area:"Quarto 205", categoria:"Elétrica", descricao:"Tomada do banheiro com faísca.", prioridade:"Urgente", solicitante:"Camareira", status:"Concluído", responsavel:"João", dataCriacao:"2025-03-09T14:00:00", dataAtualizacao:"2025-03-09T16:30:00", observacoes:"", solucao:"Tomada substituída.", recorrente:false },
  { id:4, area:"Restaurante", categoria:"Equipamentos", descricao:"Cafeteira industrial com defeito, não esquenta.", prioridade:"Média", solicitante:"Gerência", status:"Paliativo", responsavel:"Carlos", dataCriacao:"2025-03-08T07:00:00", dataAtualizacao:"2025-03-09T08:00:00", observacoes:"Usando cafeteira reserva.", solucao:"Em conserto externo.", recorrente:true },
  { id:5, area:"Quarto 103", categoria:"Hidráulica", descricao:"Chuveiro com pressão baixa.", prioridade:"Média", solicitante:"Recepção", status:"Aberto", responsavel:"", dataCriacao:"2025-03-10T11:00:00", dataAtualizacao:"2025-03-10T11:00:00", observacoes:"", solucao:"", recorrente:false },
];

function timeAgo(d) {
  const s = (new Date() - new Date(d)) / 1000;
  if (s < 60) return "agora";
  if (s < 3600) return `${Math.floor(s/60)}min atrás`;
  if (s < 86400) return `${Math.floor(s/3600)}h atrás`;
  return `${Math.floor(s/86400)}d atrás`;
}

// ─── SVG LOGO ────────────────────────────────────────────────────
function SunLogo({ size = 36 }) {
  const rays = [
    { color: B.verde,    d: "M50,48 L30,10 L38,8 Z" },
    { color: B.amarelo,  d: "M50,48 L38,8  L47,7 Z" },
    { color: B.vermelho, d: "M50,48 L47,7  L56,8 Z" },
    { color: B.verde,    d: "M50,48 L56,8  L64,10 Z" },
    { color: B.amarelo,  d: "M50,48 L64,10 L71,14 Z" },
    { color: B.vermelho, d: "M50,48 L71,14 L77,20 Z" },
    { color: B.amarelo,  d: "M50,48 L77,20 L82,27 Z" },
    { color: B.verde,    d: "M50,48 L82,27 L85,35 Z" },
    { color: B.amarelo,  d: "M50,48 L22,27 L18,35 Z" },
    { color: B.vermelho, d: "M50,48 L27,20 L22,27 Z" },
    { color: B.verde,    d: "M50,48 L35,13 L27,20 Z" },
  ];
  return (
    <svg width={size} height={size * 0.6} viewBox="15 5 70 48" fill="none">
      {rays.map((r, i) => <path key={i} d={r.d} fill={r.color} />)}
      <path d="M18,48 Q50,30 82,48" stroke={B.verde} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ─── BADGE COMPONENTS ────────────────────────────────────────────
function StatusBadge({ status }) {
  const c = statusBadge[status];
  return (
    <span style={{ background: c + "22", color: c, border: `1px solid ${c}55`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}>
      {status}
    </span>
  );
}
function PrioBadge({ p }) {
  const c = prioColor[p];
  return (
    <span style={{ background: c + "22", color: c, border: `1px solid ${c}55`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
      {prioIcon[p]} {p}
    </span>
  );
}

// ─── MODAL DETALHE ───────────────────────────────────────────────
function Modal({ os, onClose, onUpdate, perfil }) {
  const [obs, setObs]     = useState(os.observacoes);
  const [sol, setSol]     = useState(os.solucao);
  const [resp, setResp]   = useState(os.responsavel);
  const [status, setStatus] = useState(os.status);
  const podeEditar = perfil === "Manutenção" || perfil === "Gerência";

  const salvar = () => {
    onUpdate({ ...os, observacoes: obs, solucao: sol, responsavel: resp, status, dataAtualizacao: new Date().toISOString() });
    onClose();
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"#2F385588",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }} onClick={onClose}>
      <div style={{ background: B.bege, borderRadius:20, maxWidth:560, width:"100%", padding:28, boxShadow:"0 24px 80px #2F385544", border:`2px solid ${B.begeDeep}` }} onClick={e=>e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:B.azulMid, marginBottom:4, letterSpacing:1 }}>OS #{String(os.id).padStart(4,"0")}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:B.azul }}>{os.area}</div>
            <div style={{ fontSize:12, color:B.azulMid, marginTop:2 }}>{os.categoria} · {os.solicitante} · {timeAgo(os.dataCriacao)}</div>
          </div>
          <button onClick={onClose} style={{ background:B.begeDeep, border:"none", color:B.azulMid, borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:15 }}>✕</button>
        </div>

        {/* Problema */}
        <div style={{ background:"#fff", borderRadius:12, padding:14, marginBottom:14, border:`1px solid ${B.begeDeep}` }}>
          <div style={{ fontSize:10, color:B.azulMid, marginBottom:4, fontWeight:700, letterSpacing:1 }}>DESCRIÇÃO</div>
          <div style={{ fontSize:14, color:B.azul, lineHeight:1.6 }}>{os.descricao}</div>
          {os.recorrente && <div style={{ marginTop:8, color:B.vermelho, fontSize:12, fontWeight:700 }}>⚠️ Problema recorrente nesta área</div>}
        </div>

        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
          <PrioBadge p={os.prioridade} />
          <StatusBadge status={status} />
        </div>

        {podeEditar && (
          <>
            {[
              { label:"RESPONSÁVEL", val:resp, set:setResp, type:"input", ph:"Nome do técnico" },
            ].map(({label,val,set,ph})=>(
              <div key={label} style={{ marginBottom:12 }}>
                <label style={{ fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1 }}>{label}</label>
                <input value={val} onChange={e=>set(e.target.value)} placeholder={ph}
                  style={{ width:"100%",background:"#fff",border:`1px solid ${B.begeDeep}`,borderRadius:8,padding:"8px 12px",color:B.azul,fontSize:13,boxSizing:"border-box" }} />
              </div>
            ))}
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1 }}>STATUS</label>
              <select value={status} onChange={e=>setStatus(e.target.value)}
                style={{ width:"100%",background:"#fff",border:`1px solid ${B.begeDeep}`,borderRadius:8,padding:"8px 12px",color:B.azul,fontSize:13,boxSizing:"border-box" }}>
                {["Aberto","Em andamento","Concluído","Paliativo"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            {[
              { label:"OBSERVAÇÕES", val:obs, set:setObs, ph:"O que foi encontrado..." },
              { label:"SOLUÇÃO APLICADA", val:sol, set:setSol, ph:"O que foi feito para resolver..." },
            ].map(({label,val,set,ph})=>(
              <div key={label} style={{ marginBottom:12 }}>
                <label style={{ fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1 }}>{label}</label>
                <textarea value={val} onChange={e=>set(e.target.value)} rows={2} placeholder={ph}
                  style={{ width:"100%",background:"#fff",border:`1px solid ${B.begeDeep}`,borderRadius:8,padding:"8px 12px",color:B.azul,fontSize:13,resize:"vertical",boxSizing:"border-box" }} />
              </div>
            ))}
            <button onClick={salvar}
              style={{ width:"100%",background:`linear-gradient(135deg,${B.verde},#3d8a72)`,border:"none",borderRadius:10,padding:"13px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",letterSpacing:0.5,fontFamily:"'DM Sans',sans-serif" }}>
              💾 SALVAR ATUALIZAÇÃO
            </button>
          </>
        )}
        {!podeEditar && os.observacoes && (
          <div style={{ background:"#fff", borderRadius:10, padding:14, border:`1px solid ${B.begeDeep}` }}>
            <div style={{ fontSize:10,color:B.azulMid,marginBottom:4,fontWeight:700,letterSpacing:1 }}>OBSERVAÇÕES</div>
            <div style={{ fontSize:13,color:B.azul }}>{os.observacoes}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NOVA OS ─────────────────────────────────────────────────────
function NovaOS({ onCriar, perfil, onClose }) {
  const [form, setForm] = useState({ area:"Quarto 101", categoria:"Elétrica", descricao:"", prioridade:"Média", solicitante: perfil === "Manutenção" ? "Recepção" : perfil });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = () => {
    if (!form.descricao.trim()) return;
    onCriar({ ...form, id:Date.now(), status:"Aberto", responsavel:"", dataCriacao:new Date().toISOString(), dataAtualizacao:new Date().toISOString(), observacoes:"", solucao:"", recorrente:false });
    onClose();
  };

  const selectStyle = { width:"100%",background:"#fff",border:`1px solid ${B.begeDeep}`,borderRadius:8,padding:"9px 12px",color:B.azul,fontSize:13,boxSizing:"border-box" };

  return (
    <div style={{ position:"fixed",inset:0,background:"#2F385588",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }} onClick={onClose}>
      <div style={{ background:B.bege,borderRadius:20,maxWidth:520,width:"100%",padding:28,boxShadow:"0 24px 80px #2F385544",border:`2px solid ${B.begeDeep}` }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:22 }}>
          <SunLogo size={32} />
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:B.azul }}>Nova Ordem de Serviço</div>
            <div style={{ fontSize:11,color:B.azulMid }}>China Park Eco Resort</div>
          </div>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
          <div>
            <label style={{ fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1 }}>ÁREA / LOCAL</label>
            <select value={form.area} onChange={e=>set("area",e.target.value)} style={selectStyle}>
              {AREAS.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1 }}>CATEGORIA</label>
            <select value={form.categoria} onChange={e=>set("categoria",e.target.value)} style={selectStyle}>
              {CATEGORIAS.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1 }}>PRIORIDADE</label>
            <select value={form.prioridade} onChange={e=>set("prioridade",e.target.value)} style={selectStyle}>
              {PRIORIDADES.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1 }}>SOLICITANTE</label>
            <select value={form.solicitante} onChange={e=>set("solicitante",e.target.value)} style={selectStyle}>
              {SOLICITANTES.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1 }}>DESCRIÇÃO DO PROBLEMA *</label>
          <textarea value={form.descricao} onChange={e=>set("descricao",e.target.value)} rows={3} placeholder="Descreva o problema com detalhes..."
            style={{ width:"100%",background:"#fff",border:`1px solid ${B.begeDeep}`,borderRadius:8,padding:"9px 12px",color:B.azul,fontSize:13,resize:"vertical",boxSizing:"border-box" }} />
        </div>

        <div style={{ display:"flex",gap:10 }}>
          <button onClick={onClose} style={{ flex:1,background:B.begeDeep,border:"none",borderRadius:10,padding:"12px",color:B.azulMid,fontWeight:700,fontSize:14,cursor:"pointer" }}>Cancelar</button>
          <button onClick={submit} style={{ flex:2,background:`linear-gradient(135deg,${B.verde},#3d8a72)`,border:"none",borderRadius:10,padding:"12px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer" }}>
            Abrir OS ✓
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────
function Dashboard({ osList }) {
  const stats = [
    { label:"Total de OS",    val: osList.length,                                    color: B.azul,     icon:"📋" },
    { label:"Abertas",        val: osList.filter(o=>o.status==="Aberto").length,      color: B.azulLight,icon:"🔵" },
    { label:"Em Andamento",   val: osList.filter(o=>o.status==="Em andamento").length,color: B.amarelo,  icon:"🔧" },
    { label:"Concluídas",     val: osList.filter(o=>o.status==="Concluído").length,   color: B.verde,    icon:"✅" },
    { label:"Paliativos",     val: osList.filter(o=>o.status==="Paliativo").length,   color: B.vermelho, icon:"⚠️" },
    { label:"Urgentes",       val: osList.filter(o=>o.prioridade==="Urgente").length, color: B.vermelho, icon:"🚨" },
  ];
  const total = osList.length || 1;
  const porCat = CATEGORIAS.map(c=>({ c, n: osList.filter(o=>o.categoria===c).length })).filter(x=>x.n>0).sort((a,b)=>b.n-a.n);
  const porArea = [...new Map(osList.map(o=>[o.area, osList.filter(x=>x.area===o.area).length])).entries()].sort((a,b)=>b[1]-a[1]).slice(0,5);

  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24 }}>
        {stats.map(({label,val,color,icon})=>(
          <div key={label} style={{ background:"#fff",borderRadius:14,padding:"16px 18px",border:`2px solid ${color}22`,boxShadow:`0 4px 20px ${color}11` }}>
            <div style={{ fontSize:20,marginBottom:4 }}>{icon}</div>
            <div style={{ fontSize:30,fontWeight:900,color,fontFamily:"'DM Mono',monospace" }}>{val}</div>
            <div style={{ fontSize:11,color:B.azulMid,marginTop:2,fontWeight:600 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        <div style={{ background:"#fff",borderRadius:14,padding:18,border:`1px solid ${B.begeDeep}` }}>
          <div style={{ fontSize:10,color:B.azulMid,fontWeight:700,marginBottom:14,letterSpacing:1 }}>POR CATEGORIA</div>
          {porCat.map(({c,n})=>(
            <div key={c} style={{ marginBottom:10 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                <span style={{ fontSize:12,color:B.azul }}>{c}</span>
                <span style={{ fontSize:12,color:B.verde,fontWeight:700 }}>{n}</span>
              </div>
              <div style={{ height:5,background:B.bege,borderRadius:4 }}>
                <div style={{ height:5,background:`linear-gradient(90deg,${B.verde},${B.amarelo})`,borderRadius:4,width:`${(n/total)*100}%`,transition:"width 0.5s" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:"#fff",borderRadius:14,padding:18,border:`1px solid ${B.begeDeep}` }}>
          <div style={{ fontSize:10,color:B.azulMid,fontWeight:700,marginBottom:14,letterSpacing:1 }}>ÁREAS COM MAIS OS</div>
          {porArea.map(([area,n])=>(
            <div key={area} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${B.bege}` }}>
              <span style={{ fontSize:13,color:B.azul }}>{area}</span>
              <span style={{ background:`${B.azul}11`,color:B.azul,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700 }}>{n} OS</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ───────────────────────────────────────────────
export default function App() {
  const [perfil, setPerfil]     = useState(null);
  const [aba, setAba]           = useState("os");
  const [osList, setOsList]     = useState(INITIAL_OS);
  const [filtroStatus, setFS]   = useState("Todos");
  const [filtroPrio, setFP]     = useState("Todas");
  const [busca, setBusca]       = useState("");
  const [modalOS, setModalOS]   = useState(null);
  const [novaOSOpen, setNova]   = useState(false);

  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
    document.body.style.margin = "0";
    document.body.style.background = B.bege;
  }, []);

  const filtrados = osList.filter(o => {
    if (filtroStatus !== "Todos" && o.status !== filtroStatus) return false;
    if (filtroPrio   !== "Todas" && o.prioridade !== filtroPrio) return false;
    if (busca && ![o.area,o.descricao,o.categoria].some(f=>f.toLowerCase().includes(busca.toLowerCase()))) return false;
    if (perfil === "Manutenção" && o.status === "Concluído") return false;
    return true;
  }).sort((a,b) => {
    const p = {Urgente:0,Alta:1,Média:2,Baixa:3};
    return p[a.prioridade] - p[b.prioridade] || new Date(b.dataCriacao) - new Date(a.dataCriacao);
  });

  // ── LOGIN ──
  if (!perfil) {
    return (
      <div style={{ minHeight:"100vh", background: B.azul, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", padding:20, position:"relative", overflow:"hidden" }}>
        {/* Decorative rays background */}
        <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", opacity:0.06 }}>
          <SunLogo size={500} />
        </div>

        <div style={{ textAlign:"center", maxWidth:440, width:"100%", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:36 }}>
            <SunLogo size={72} />
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38, fontWeight:800, color:B.branco, lineHeight:1.1, marginTop:12 }}>China Park</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, color:B.verde, letterSpacing:4, marginTop:2 }}>ECO RESORT</div>
            <div style={{ width:40, height:2, background:`linear-gradient(90deg,${B.vermelho},${B.amarelo},${B.verde})`, borderRadius:2, margin:"14px auto 6px" }} />
            <div style={{ fontSize:12, color:"#ffffff66", letterSpacing:2, fontWeight:500 }}>SISTEMA DE MANUTENÇÃO</div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {["Recepção","Camareira","Gerência","Manutenção"].map(p => (
              <button key={p} onClick={()=>setPerfil(p)}
                style={{ background:"#ffffff0d", border:"1px solid #ffffff1a", borderRadius:14, padding:"16px 22px", color:B.branco, fontSize:15, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:14, textAlign:"left", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="#ffffff1a"; e.currentTarget.style.borderColor=B.verde; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="#ffffff0d"; e.currentTarget.style.borderColor="#ffffff1a"; }}
              >
                <span style={{ fontSize:26, minWidth:32, textAlign:"center" }}>{PERFIL_ICON[p]}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700 }}>{p}</div>
                  <div style={{ fontSize:11, color:"#ffffff66", marginTop:2 }}>{PERFIL_DESC[p]}</div>
                </div>
                <span style={{ color:B.verde, fontSize:18 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── HEADER ──
  const abas = perfil === "Gerência" ? ["os","dashboard"] : ["os"];
  const abaLabel = { os:"📋 Ordens de Serviço", dashboard:"📊 Dashboard" };

  return (
    <div style={{ minHeight:"100vh", background:B.bege, fontFamily:"'DM Sans',sans-serif", color:B.azul }}>

      {/* Header */}
      <div style={{ background:B.azul, padding:"0 20px", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 20px #2F385533" }}>
        <div style={{ maxWidth:960, margin:"0 auto", display:"flex", alignItems:"center", gap:14, height:58 }}>
          <SunLogo size={30} />
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:800, fontSize:17, color:B.branco, lineHeight:1 }}>China Park</div>
            <div style={{ fontSize:9, color:B.verde, letterSpacing:2.5, fontWeight:700 }}>ECO RESORT</div>
          </div>
          <div style={{ width:1, height:28, background:"#ffffff22", margin:"0 4px" }} />
          <div style={{ flex:1, display:"flex", gap:4 }}>
            {abas.map(a=>(
              <button key={a} onClick={()=>setAba(a)} style={{
                background: aba===a ? `${B.verde}22` : "transparent",
                border: aba===a ? `1px solid ${B.verde}55` : "1px solid transparent",
                color: aba===a ? B.verde : "#ffffff66",
                borderRadius:8, padding:"5px 14px", cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"'DM Sans',sans-serif"
              }}>{abaLabel[a]}</button>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", background:"#ffffff11", borderRadius:20, border:"1px solid #ffffff22" }}>
            <span>{PERFIL_ICON[perfil]}</span>
            <span style={{ fontSize:12, color:"#ffffffcc", fontWeight:600 }}>{perfil}</span>
            <button onClick={()=>setPerfil(null)} style={{ background:"none", border:"none", color:"#ffffff66", cursor:"pointer", fontSize:14, marginLeft:4, lineHeight:1 }}>✕</button>
          </div>
        </div>
      </div>

      {/* Faixa colorida */}
      <div style={{ height:3, background:`linear-gradient(90deg,${B.vermelho},${B.amarelo},${B.verde},${B.azulLight})` }} />

      <div style={{ maxWidth:960, margin:"0 auto", padding:"20px 16px" }}>
        {aba === "dashboard" && perfil === "Gerência" ? <Dashboard osList={osList} /> : (
          <>
            {/* Filtros */}
            <div style={{ background:"#fff", borderRadius:14, padding:14, marginBottom:16, border:`1px solid ${B.begeDeep}`, display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", boxShadow:"0 2px 12px #2F385508" }}>
              <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔍 Buscar por área, categoria..."
                style={{ flex:"1 1 180px", background:B.bege, border:`1px solid ${B.begeDeep}`, borderRadius:8, padding:"8px 12px", color:B.azul, fontSize:13 }} />
              <select value={filtroStatus} onChange={e=>setFS(e.target.value)}
                style={{ background:B.bege, border:`1px solid ${B.begeDeep}`, borderRadius:8, padding:"8px 12px", color:B.azul, fontSize:12 }}>
                {["Todos","Aberto","Em andamento","Concluído","Paliativo"].map(o=><option key={o}>{o}</option>)}
              </select>
              <select value={filtroPrio} onChange={e=>setFP(e.target.value)}
                style={{ background:B.bege, border:`1px solid ${B.begeDeep}`, borderRadius:8, padding:"8px 12px", color:B.azul, fontSize:12 }}>
                {["Todas","Urgente","Alta","Média","Baixa"].map(o=><option key={o}>{o}</option>)}
              </select>
              <button onClick={()=>setNova(true)}
                style={{ background:`linear-gradient(135deg,${B.verde},#3d8a72)`, border:"none", borderRadius:10, padding:"9px 20px", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer", whiteSpace:"nowrap", boxShadow:`0 4px 14px ${B.verde}44` }}>
                + Nova OS
              </button>
            </div>

            {/* Contador */}
            <div style={{ fontSize:11, color:B.azulMid, marginBottom:12, fontFamily:"'DM Mono',monospace", letterSpacing:0.5 }}>
              {filtrados.length} ordem{filtrados.length!==1?"s":""} de serviço
            </div>

            {/* Cards OS */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {filtrados.length === 0 && (
                <div style={{ textAlign:"center", padding:48, color:B.azulMid, background:"#fff", borderRadius:14, border:`1px solid ${B.begeDeep}` }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>✅</div>
                  <div style={{ fontWeight:600 }}>Nenhuma OS encontrada</div>
                </div>
              )}
              {filtrados.map(os => {
                const sc = statusBadge[os.status];
                return (
                  <div key={os.id} onClick={()=>setModalOS(os)}
                    style={{ background:"#fff", border:`1px solid ${B.begeDeep}`, borderLeft:`4px solid ${prioColor[os.prioridade]}`, borderRadius:"0 12px 12px 0", padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, boxShadow:"0 2px 8px #2F385506", transition:"all 0.15s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 4px 20px #2F385514"; e.currentTarget.style.transform="translateX(2px)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 2px 8px #2F385506"; e.currentTarget.style.transform="translateX(0)"; }}
                  >
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:B.azulMid, minWidth:40, letterSpacing:0.5 }}>
                      #{String(os.id).padStart(4,"0")}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                        <span style={{ fontWeight:700, fontSize:14, color:B.azul, fontFamily:"'Cormorant Garamond',serif" }}>{os.area}</span>
                        <span style={{ fontSize:11, color:B.azulMid }}>·</span>
                        <span style={{ fontSize:12, color:B.azulMid }}>{os.categoria}</span>
                        {os.recorrente && <span style={{ fontSize:10, color:B.vermelho, background:`${B.vermelho}11`, padding:"1px 7px", borderRadius:10, border:`1px solid ${B.vermelho}33`, fontWeight:700 }}>RECORRENTE</span>}
                      </div>
                      <div style={{ fontSize:13, color:B.azulMid, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{os.descricao}</div>
                      <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap", alignItems:"center" }}>
                        <StatusBadge status={os.status} />
                        <PrioBadge p={os.prioridade} />
                        {os.responsavel && <span style={{ fontSize:11, color:B.azulMid }}>🔧 {os.responsavel}</span>}
                        <span style={{ fontSize:11, color:B.begeDeep, marginLeft:"auto", color:B.azulMid }}>{timeAgo(os.dataCriacao)}</span>
                      </div>
                    </div>
                    <span style={{ color:B.begeDeep, fontSize:18, color:B.azulMid }}>›</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {modalOS && (
        <Modal os={modalOS} onClose={()=>setModalOS(null)} perfil={perfil}
          onUpdate={u=>{ setOsList(l=>l.map(o=>o.id===u.id?u:o)); setModalOS(null); }} />
      )}
      {novaOSOpen && (
        <NovaOS perfil={perfil} onClose={()=>setNova(false)}
          onCriar={nova=>{ setOsList(l=>[nova,...l]); }} />
      )}
    </div>
  );
}