import { useState, useEffect, useRef } from "react";

const B = {
  azul:"#2F3855",azulMid:"#3d4f6e",azulLight:"#4a5f82",
  verde:"#57A68C",verdeLight:"#6dbfa3",vermelho:"#FF4546",
  amarelo:"#F7B846",bege:"#F3EEE8",begeDeep:"#e8dfd4",
  branco:"#FFFFFF",laranja:"#f5924a",
};

const UNIDADES = [
  ...Array.from({length:50},(_,i)=>`Quarto ${101+i}`),
  ...Array.from({length:20},(_,i)=>`Bangalô ${1+i}`),
  ...Array.from({length:10},(_,i)=>`Suíte ${1+i}`),
  ...Array.from({length:10},(_,i)=>`Chalé ${1+i}`),
  ...Array.from({length:5},(_,i)=>`Villa ${1+i}`),
];

const ESTRUTURAS = [
  {grupo:"Alimentação & Bar",itens:["Restaurante","Cozinha Industrial","Copa","Bar da Piscina","Bar do Lobby","Salão de Café da Manhã"]},
  {grupo:"Lazer & Recreação",itens:["Piscina Principal","Piscina Infantil","Área de Chapuzo","Deck da Piscina","Área de Churrasqueira","Quiosque","Quadra de Tênis","Quadra Poliesportiva","Playground","Trilha Ecológica","Lago Ornamental","Píer"]},
  {grupo:"Bem-Estar",itens:["Academia","Spa","Sauna","Banheiro Spa","Vestiário Masculino","Vestiário Feminino"]},
  {grupo:"Eventos",itens:["Salão de Eventos","Salão de Festas","Auditório","Terraço de Eventos"]},
  {grupo:"Áreas Comuns",itens:["Recepção","Lobby","Hall de Entrada","Corredor Térreo","Corredor 1º Andar","Corredor 2º Andar","Elevador 1","Elevador 2","Escada de Serviço"]},
  {grupo:"Jardins & Externo",itens:["Jardim Frontal","Jardim dos Fundos","Jardim Lateral","Estacionamento","Entrada Principal","Portaria","Guarita","Heliporto"]},
  {grupo:"Infraestrutura",itens:["Lavanderia","Depósito","Almoxarifado","Copa de Funcionários","Gerador","Caixa D'água","Casa de Bombas","CFTV","Subestação Elétrica"]},
];

const TODAS_ESTRUTURAS = ESTRUTURAS.flatMap(g=>g.itens);

const CATEGORIAS = ["Elétrica","Hidráulica","Ar-condicionado","Mobiliário","Limpeza especial","Pintura","Estrutural","Equipamentos","Jardinagem","Paisagismo","Segurança","Outro"];
const PRIORIDADES = ["Baixa","Média","Alta","Urgente"];
const MOTIVOS_PENDENCIA = ["Aguardando peça/material","Falta de mão de obra","Aguardando autorização","Horário restrito (hóspede)","Serviço externo agendado","Outro motivo"];
const SATISFACAO_OPTS = ["Ótimo","Bom","Regular","Ruim"];
const SATISFACAO_COLOR = {"Ótimo":"#57A68C","Bom":"#6dbfa3","Regular":"#F7B846","Ruim":"#FF4546"};
const SATISFACAO_ICON = {"Ótimo":"😄","Bom":"🙂","Regular":"😐","Ruim":"😞"};
const prioColor = {Baixa:B.verde,Média:B.amarelo,Alta:B.laranja,Urgente:B.vermelho};
const prioIcon = {Baixa:"🟢",Média:"🟡",Alta:"🟠",Urgente:"🔴"};
const statusColor = {"Aberto":B.azulLight,"Em andamento":B.amarelo,"Concluído":B.verde,"Paliativo":B.laranja,"Pendente":B.vermelho};
const PERFIL_ICON = {"Recepção":"🛎️","Camareira":"🛏️","Gerência":"👔","Manutenção":"🔧"};
const PERFIL_DESC = {"Recepção":"Abrir e acompanhar chamados","Camareira":"Reportar problemas nos quartos","Gerência":"Visão completa e relatórios","Manutenção":"Executar e atualizar OS"};

const daysAgo=(d)=>{const r=new Date();r.setDate(r.getDate()-d);return r.toISOString();};
const now=()=>new Date().toISOString();

const INITIAL_OS=[
  {id:1,tipoArea:"unidade",area:"Quarto 102",categoria:"Ar-condicionado",descricao:"Ar-condicionado não está gelando, hóspede reclamou duas vezes.",prioridade:"Alta",nomesolicitante:"Ana Paula",fotoSolicitante:"",solicitante:"Recepção",status:"Em andamento",responsavel:"Carlos",dataCriacao:daysAgo(2),dataAtualizacao:daysAgo(1),observacoes:"Verificado filtro, precisa trocar gás.",solucao:"",recorrente:true,motivoPendencia:"",satisfacao:"",contatoSatisfacao:false},
  {id:2,tipoArea:"estrutura",area:"Piscina Principal",categoria:"Hidráulica",descricao:"Vazamento na bomba de recirculação da piscina.",prioridade:"Urgente",nomesolicitante:"Roberto",fotoSolicitante:"",solicitante:"Gerência",status:"Pendente",responsavel:"",dataCriacao:daysAgo(1),dataAtualizacao:daysAgo(1),observacoes:"",solucao:"",recorrente:false,motivoPendencia:"Aguardando peça/material",satisfacao:"",contatoSatisfacao:false},
  {id:3,tipoArea:"unidade",area:"Quarto 205",categoria:"Elétrica",descricao:"Tomada do banheiro com faísca.",prioridade:"Urgente",nomesolicitante:"Fernanda",fotoSolicitante:"",solicitante:"Camareira",status:"Concluído",responsavel:"João",dataCriacao:daysAgo(3),dataAtualizacao:daysAgo(2),observacoes:"",solucao:"Tomada substituída.",recorrente:false,motivoPendencia:"",satisfacao:"Ótimo",contatoSatisfacao:true},
  {id:4,tipoArea:"estrutura",area:"Restaurante",categoria:"Equipamentos",descricao:"Cafeteira industrial com defeito, não esquenta.",prioridade:"Média",nomesolicitante:"Marcos",fotoSolicitante:"",solicitante:"Gerência",status:"Paliativo",responsavel:"Carlos",dataCriacao:daysAgo(4),dataAtualizacao:daysAgo(3),observacoes:"Usando cafeteira reserva.",solucao:"Em conserto externo.",recorrente:true,motivoPendencia:"",satisfacao:"Regular",contatoSatisfacao:true},
  {id:5,tipoArea:"unidade",area:"Quarto 103",categoria:"Hidráulica",descricao:"Chuveiro com pressão baixa.",prioridade:"Média",nomesolicitante:"Juliana",fotoSolicitante:"",solicitante:"Recepção",status:"Aberto",responsavel:"",dataCriacao:daysAgo(1),dataAtualizacao:daysAgo(1),observacoes:"",solucao:"",recorrente:false,motivoPendencia:"",satisfacao:"",contatoSatisfacao:false},
  {id:6,tipoArea:"estrutura",area:"Jardim Frontal",categoria:"Jardinagem",descricao:"Árvore com galho caído bloqueando caminho.",prioridade:"Alta",nomesolicitante:"Paulo",fotoSolicitante:"",solicitante:"Gerência",status:"Aberto",responsavel:"",dataCriacao:daysAgo(0),dataAtualizacao:daysAgo(0),observacoes:"",solucao:"",recorrente:false,motivoPendencia:"",satisfacao:"",contatoSatisfacao:false},
];

function timeAgo(d){const s=(new Date()-new Date(d))/1000;if(s<60)return"agora";if(s<3600)return`${Math.floor(s/60)}min atrás`;if(s<86400)return`${Math.floor(s/3600)}h atrás`;return`${Math.floor(s/86400)}d atrás`;}

function SunLogo({size=36}){
  const rays=[
    {color:B.verde,d:"M50,48 L30,10 L38,8 Z"},{color:B.amarelo,d:"M50,48 L38,8 L47,7 Z"},
    {color:B.vermelho,d:"M50,48 L47,7 L56,8 Z"},{color:B.verde,d:"M50,48 L56,8 L64,10 Z"},
    {color:B.amarelo,d:"M50,48 L64,10 L71,14 Z"},{color:B.vermelho,d:"M50,48 L71,14 L77,20 Z"},
    {color:B.amarelo,d:"M50,48 L77,20 L82,27 Z"},{color:B.verde,d:"M50,48 L82,27 L85,35 Z"},
    {color:B.amarelo,d:"M50,48 L22,27 L18,35 Z"},{color:B.vermelho,d:"M50,48 L27,20 L22,27 Z"},
    {color:B.verde,d:"M50,48 L35,13 L27,20 Z"},
  ];
  return(<svg width={size} height={size*0.6} viewBox="15 5 70 48" fill="none">{rays.map((r,i)=><path key={i} d={r.d} fill={r.color}/>)}<path d="M18,48 Q50,30 82,48" stroke={B.verde} strokeWidth="3.5" fill="none" strokeLinecap="round"/></svg>);
}

function StatusBadge({status}){const c=statusColor[status]||B.azulMid;return<span style={{background:`${c}22`,color:c,border:`1px solid ${c}55`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{status}</span>;}
function PrioBadge({p}){const c=prioColor[p];return<span style={{background:`${c}22`,color:c,border:`1px solid ${c}55`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{prioIcon[p]} {p}</span>;}
function TipoBadge({tipo}){
  const isUn=tipo==="unidade";
  return<span style={{background:isUn?`${B.azulLight}22`:`${B.verde}22`,color:isUn?B.azulLight:B.verde,border:`1px solid ${isUn?B.azulLight:B.verde}44`,borderRadius:20,padding:"2px 9px",fontSize:10,fontWeight:700}}>{isUn?"🏠 UNIDADE":"🏗️ ESTRUTURA"}</span>;
}

function UnidadeAutocomplete({value,onChange}){
  const [open,setOpen]=useState(false);
  const [query,setQuery]=useState(value);
  const ref=useRef(null);
  const filtradas=UNIDADES.filter(u=>u.toLowerCase().includes(query.toLowerCase())).slice(0,8);
  useEffect(()=>{setQuery(value);},[value]);
  useEffect(()=>{
    const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);
  return(
    <div ref={ref} style={{position:"relative"}}>
      <input value={query}
        onChange={e=>{setQuery(e.target.value);setOpen(true);onChange(e.target.value);}}
        onFocus={()=>setOpen(true)}
        placeholder="Ex: Quarto 102, Bangalô 5, Suíte 3..."
        style={{width:"100%",background:"#fff",border:`1px solid ${B.begeDeep}`,borderRadius:8,padding:"9px 12px",color:B.azul,fontSize:13,boxSizing:"border-box"}}/>
      {open&&filtradas.length>0&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:`1px solid ${B.begeDeep}`,borderRadius:10,boxShadow:"0 8px 32px #2F385522",zIndex:9999,maxHeight:220,overflowY:"auto",marginTop:4}}>
          {filtradas.map(u=>(<div key={u} onMouseDown={()=>{onChange(u);setQuery(u);setOpen(false);}}
            style={{padding:"9px 14px",cursor:"pointer",fontSize:13,color:B.azul,borderBottom:`1px solid ${B.bege}`}}
            onMouseEnter={e=>e.currentTarget.style.background=B.bege}
            onMouseLeave={e=>e.currentTarget.style.background="#fff"}>{u}</div>))}
        </div>
      )}
    </div>
  );
}

function EstruturaSelector({value,onChange}){
  const [busca,setBusca]=useState("");
  const grupos = busca
    ? [{grupo:"Resultados",itens:TODAS_ESTRUTURAS.filter(e=>e.toLowerCase().includes(busca.toLowerCase()))}]
    : ESTRUTURAS;
  return(
    <div>
      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔍 Filtrar estrutura..."
        style={{width:"100%",background:"#fff",border:`1px solid ${B.begeDeep}`,borderRadius:8,padding:"8px 12px",color:B.azul,fontSize:13,boxSizing:"border-box",marginBottom:10}}/>
      <div style={{maxHeight:220,overflowY:"auto"}}>
        {grupos.map(({grupo,itens})=>(
          <div key={grupo} style={{marginBottom:10}}>
            <div style={{fontSize:9,color:B.azulMid,fontWeight:700,letterSpacing:1,marginBottom:6,paddingLeft:2}}>{grupo.toUpperCase()}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {itens.map(e=>(
                <button key={e} onMouseDown={()=>onChange(e)}
                  style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${value===e?B.verde:B.begeDeep}`,background:value===e?`${B.verde}22`:"#f9f5f0",color:value===e?B.verde:B.azulMid,cursor:"pointer",fontSize:12,fontWeight:value===e?700:400,transition:"all 0.1s",whiteSpace:"nowrap"}}>
                  {e}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Modal({os,onClose,onUpdate,perfil}){
  const [obs,setObs]=useState(os.observacoes);
  const [sol,setSol]=useState(os.solucao);
  const [resp,setResp]=useState(os.responsavel);
  const [status,setStatus]=useState(os.status);
  const [motivo,setMotivo]=useState(os.motivoPendencia);
  const [sat,setSat]=useState(os.satisfacao);
  const [contato,setContato]=useState(os.contatoSatisfacao);
  const podeEditar=perfil==="Manutenção"||perfil==="Gerência";
  const podeContato=perfil==="Recepção"||perfil==="Gerência";
  const concluido=["Concluído","Paliativo"].includes(os.status);
  const inp={width:"100%",background:"#fff",border:`1px solid ${B.begeDeep}`,borderRadius:8,padding:"8px 12px",color:B.azul,fontSize:13,boxSizing:"border-box"};
  const podeSalvar=status!=="Pendente"||(motivo&&motivo!=="");
  const salvar=()=>{
    if(!podeSalvar)return;
    onUpdate({...os,observacoes:obs,solucao:sol,responsavel:resp,status,motivoPendencia:status==="Pendente"?motivo:"",satisfacao:sat,contatoSatisfacao:contato,dataAtualizacao:now()});
    onClose();
  };
  return(
    <div style={{position:"fixed",inset:0,background:"#2F385588",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px 16px",overflowY:"auto"}} onClick={onClose}>
      <div style={{background:B.bege,borderRadius:20,maxWidth:580,width:"100%",padding:28,boxShadow:"0 24px 80px #2F385544",border:`2px solid ${B.begeDeep}`,marginTop:"auto",marginBottom:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:B.azulMid,marginBottom:4,letterSpacing:1}}>OS #{String(os.id).padStart(4,"0")}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:B.azul}}>{os.area}</div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
              {os.fotoSolicitante
                ?<img src={os.fotoSolicitante} style={{width:26,height:26,borderRadius:"50%",objectFit:"cover",border:`2px solid ${B.verde}`}} alt=""/>
                :<span style={{fontSize:16}}>👤</span>}
              <span style={{fontSize:12,color:B.azulMid}}><strong>{os.nomesolicitante||os.solicitante}</strong> · {os.categoria} · {timeAgo(os.dataCriacao)}</span>
            </div>
          </div>
          <button onClick={onClose} style={{background:B.begeDeep,border:"none",color:B.azulMid,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:15}}>✕</button>
        </div>

        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}><TipoBadge tipo={os.tipoArea}/><PrioBadge p={os.prioridade}/><StatusBadge status={status}/></div>

        <div style={{background:"#fff",borderRadius:12,padding:14,marginBottom:14,border:`1px solid ${B.begeDeep}`}}>
          <div style={{fontSize:10,color:B.azulMid,marginBottom:4,fontWeight:700,letterSpacing:1}}>DESCRIÇÃO</div>
          <div style={{fontSize:14,color:B.azul,lineHeight:1.6}}>{os.descricao}</div>
          {os.recorrente&&<div style={{marginTop:8,color:B.vermelho,fontSize:12,fontWeight:700}}>⚠️ Problema recorrente nesta área</div>}
        </div>

        {os.status==="Pendente"&&os.motivoPendencia&&(
          <div style={{background:`${B.vermelho}11`,borderRadius:10,padding:12,marginBottom:14,border:`1px solid ${B.vermelho}33`}}>
            <div style={{fontSize:10,color:B.vermelho,fontWeight:700,letterSpacing:1,marginBottom:4}}>⏸️ MOTIVO DA PENDÊNCIA</div>
            <div style={{fontSize:13,color:B.azul}}>{os.motivoPendencia}</div>
          </div>
        )}

        {podeEditar&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div>
                <label style={{fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1}}>RESPONSÁVEL</label>
                <input value={resp} onChange={e=>setResp(e.target.value)} placeholder="Nome do técnico" style={inp}/>
              </div>
              <div>
                <label style={{fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1}}>STATUS</label>
                <select value={status} onChange={e=>setStatus(e.target.value)} style={inp}>
                  {["Aberto","Em andamento","Pendente","Concluído","Paliativo"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {status==="Pendente"&&(
              <div style={{marginBottom:12,background:`${B.vermelho}08`,borderRadius:12,padding:14,border:`1.5px solid ${B.vermelho}44`}}>
                <div style={{fontSize:10,color:B.vermelho,fontWeight:700,letterSpacing:1,marginBottom:8}}>⏸️ MOTIVO DA PENDÊNCIA <span style={{color:B.vermelho}}>*obrigatório</span></div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {MOTIVOS_PENDENCIA.map(m=>(
                    <button key={m} onClick={()=>setMotivo(m)}
                      style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${motivo===m?B.vermelho:B.begeDeep}`,background:motivo===m?`${B.vermelho}18`:"#fff",color:motivo===m?B.vermelho:B.azulMid,cursor:"pointer",fontSize:12,fontWeight:motivo===m?700:400,transition:"all 0.12s"}}>
                      {m}
                    </button>
                  ))}
                </div>
                {!motivo&&<div style={{fontSize:11,color:B.vermelho,marginTop:8}}>⚠️ Selecione o motivo para salvar</div>}
              </div>
            )}

            {[{label:"OBSERVAÇÕES",val:obs,set:setObs,ph:"O que foi encontrado..."},{label:"SOLUÇÃO APLICADA",val:sol,set:setSol,ph:"O que foi feito para resolver..."}].map(({label,val,set,ph})=>(
              <div key={label} style={{marginBottom:12}}>
                <label style={{fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1}}>{label}</label>
                <textarea value={val} onChange={e=>set(e.target.value)} rows={2} placeholder={ph} style={{...inp,resize:"vertical"}}/>
              </div>
            ))}
            <button onClick={salvar}
              style={{width:"100%",background:podeSalvar?`linear-gradient(135deg,${B.verde},#3d8a72)`:B.begeDeep,border:"none",borderRadius:10,padding:"13px",color:podeSalvar?"#fff":B.azulMid,fontWeight:800,fontSize:14,cursor:podeSalvar?"pointer":"not-allowed"}}>
              💾 SALVAR ATUALIZAÇÃO
            </button>
          </>
        )}

        {podeContato&&concluido&&(
          <div style={{marginTop:16,background:`${B.verde}11`,borderRadius:14,padding:16,border:`1px solid ${B.verde}33`}}>
            <div style={{fontSize:11,color:B.verde,fontWeight:700,letterSpacing:1,marginBottom:12}}>⭐ REGISTRO DE SATISFAÇÃO DO HÓSPEDE</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
              {SATISFACAO_OPTS.map(opt=>(
                <button key={opt} onClick={()=>setSat(opt)}
                  style={{flex:"1 1 70px",padding:"10px 6px",borderRadius:10,border:`2px solid ${sat===opt?SATISFACAO_COLOR[opt]:B.begeDeep}`,background:sat===opt?`${SATISFACAO_COLOR[opt]}22`:"#fff",color:sat===opt?SATISFACAO_COLOR[opt]:B.azulMid,cursor:"pointer",fontWeight:700,fontSize:12,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <span style={{fontSize:20}}>{SATISFACAO_ICON[opt]}</span>{opt}
                </button>
              ))}
            </div>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:B.azul,marginBottom:sat?12:0}}>
              <input type="checkbox" checked={contato} onChange={e=>setContato(e.target.checked)} style={{width:16,height:16,accentColor:B.verde}}/>
              Contato realizado com o hóspede ✓
            </label>
            {sat&&<button onClick={salvar} style={{width:"100%",background:`linear-gradient(135deg,${B.verde},#3d8a72)`,border:"none",borderRadius:10,padding:"11px",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer"}}>💾 SALVAR SATISFAÇÃO</button>}
          </div>
        )}

        {!podeEditar&&!podeContato&&obs&&(
          <div style={{background:"#fff",borderRadius:10,padding:14,border:`1px solid ${B.begeDeep}`}}>
            <div style={{fontSize:10,color:B.azulMid,marginBottom:4,fontWeight:700,letterSpacing:1}}>OBSERVAÇÕES</div>
            <div style={{fontSize:13,color:B.azul}}>{obs}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function NovaOS({onCriar,perfil,onClose}){
  const [tipoArea,setTipoArea]=useState("unidade");
  const [area,setArea]=useState("Quarto 101");
  const [categoria,setCategoria]=useState("Elétrica");
  const [descricao,setDescricao]=useState("");
  const [prioridade,setPrioridade]=useState("Média");
  const [nomesolicitante,setNome]=useState("");
  const [fotoSolicitante,setFoto]=useState("");
  const [solicitante,setSolicitante]=useState(perfil==="Manutenção"?"Recepção":perfil);
  const fotoInputRef=useRef(null);

  const inp={width:"100%",background:"#fff",border:`1px solid ${B.begeDeep}`,borderRadius:8,padding:"9px 12px",color:B.azul,fontSize:13,boxSizing:"border-box"};
  const ok=descricao.trim()&&nomesolicitante.trim()&&area.trim();

  const handleFoto=(e)=>{
    const f=e.target.files?.[0];
    if(!f)return;
    const r=new FileReader();
    r.onload=ev=>setFoto(ev.target.result);
    r.readAsDataURL(f);
  };

  const submit=()=>{
    if(!ok)return;
    onCriar({tipoArea,area,categoria,descricao,prioridade,nomesolicitante,fotoSolicitante,solicitante,
      id:Date.now(),status:"Aberto",responsavel:"",dataCriacao:now(),dataAtualizacao:now(),
      observacoes:"",solucao:"",recorrente:false,motivoPendencia:"",satisfacao:"",contatoSatisfacao:false});
    onClose();
  };

  return(
    <div style={{position:"fixed",inset:0,background:"#2F385588",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"16px",overflowY:"auto"}} onClick={onClose}>
      <div style={{background:B.bege,borderRadius:20,maxWidth:560,width:"100%",padding:24,boxShadow:"0 24px 80px #2F385544",border:`2px solid ${B.begeDeep}`,marginTop:20,marginBottom:20}} onClick={e=>e.stopPropagation()}>

        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <SunLogo size={32}/>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:B.azul}}>Nova Ordem de Serviço</div>
            <div style={{fontSize:11,color:B.azulMid}}>China Park Eco Resort</div>
          </div>
          <button onClick={onClose} style={{marginLeft:"auto",background:B.begeDeep,border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:14,color:B.azulMid}}>✕</button>
        </div>

        <div style={{background:"#fff",borderRadius:14,padding:16,marginBottom:12,border:`1px solid ${B.begeDeep}`}}>
          <div style={{fontSize:10,color:B.azulMid,fontWeight:700,letterSpacing:1,marginBottom:12}}>📍 ÁREA / LOCAL</div>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {[
              {v:"unidade",icon:"🏠",label:"Unidade",sub:"Quartos · Bangalôs · Suítes · Chalés"},
              {v:"estrutura",icon:"🏗️",label:"Estrutura",sub:"Piscina · Cozinha · Jardim · Spa..."}
            ].map(({v,icon,label,sub})=>(
              <button key={v} onClick={()=>{setTipoArea(v);setArea(v==="unidade"?"Quarto 101":"Piscina Principal");}}
                style={{flex:1,padding:"12px 10px",borderRadius:12,border:`2px solid ${tipoArea===v?B.verde:B.begeDeep}`,background:tipoArea===v?`${B.verde}11`:"#f9f5f0",cursor:"pointer",textAlign:"center",transition:"all 0.15s"}}>
                <div style={{fontSize:26,marginBottom:3}}>{icon}</div>
                <div style={{fontWeight:700,fontSize:13,color:tipoArea===v?B.verde:B.azul}}>{label}</div>
                <div style={{fontSize:10,color:B.azulMid,marginTop:2}}>{sub}</div>
              </button>
            ))}
          </div>
          {tipoArea==="unidade"?(
            <div>
              <label style={{fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1}}>UNIDADE</label>
              <UnidadeAutocomplete value={area} onChange={setArea}/>
            </div>
          ):(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <label style={{fontSize:10,color:B.azulMid,fontWeight:700,letterSpacing:1}}>ESTRUTURA:</label>
                <span style={{background:`${B.verde}22`,color:B.verde,borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700}}>{area}</span>
              </div>
              <EstruturaSelector value={area} onChange={setArea}/>
            </div>
          )}
        </div>

        <div style={{background:"#fff",borderRadius:14,padding:16,marginBottom:12,border:`1px solid ${B.begeDeep}`}}>
          <div style={{fontSize:10,color:B.azulMid,fontWeight:700,letterSpacing:1,marginBottom:12}}>🔧 DETALHES</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div>
              <label style={{fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1}}>CATEGORIA</label>
              <select value={categoria} onChange={e=>setCategoria(e.target.value)} style={inp}>{CATEGORIAS.map(o=><option key={o}>{o}</option>)}</select>
            </div>
            <div>
              <label style={{fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1}}>PRIORIDADE</label>
              <select value={prioridade} onChange={e=>setPrioridade(e.target.value)} style={inp}>{PRIORIDADES.map(o=><option key={o}>{o}</option>)}</select>
            </div>
          </div>
          <label style={{fontSize:10,color:B.azulMid,display:"block",marginBottom:4,fontWeight:700,letterSpacing:1}}>DESCRIÇÃO DO PROBLEMA *</label>
          <textarea value={descricao} onChange={e=>setDescricao(e.target.value)} rows={3} placeholder="Descreva o problema com detalhes..." style={{...inp,resize:"vertical"}}/>
        </div>

        <div style={{background:"#fff",borderRadius:14,padding:16,marginBottom:16,border:`1px solid ${B.begeDeep}`}}>
          <div style={{fontSize:10,color:B.azulMid,fontWeight:700,letterSpacing:1,marginBottom:12}}>👤 SOLICITANTE</div>
          <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
            <div style={{position:"relative",flexShrink:0}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:fotoSolicitante?"transparent":B.begeDeep,border:`2px solid ${fotoSolicitante?B.verde:B.begeDeep}`,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color 0.2s"}}>
                {fotoSolicitante
                  ?<img src={fotoSolicitante} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="foto"/>
                  :<span style={{fontSize:26}}>👤</span>}
              </div>
              <label style={{position:"absolute",bottom:0,right:0,width:22,height:22,background:B.verde,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"2px solid #fff",boxShadow:"0 2px 6px #0003"}}>
                <span style={{fontSize:11}}>📷</span>
                <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={handleFoto}/>
              </label>
            </div>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
              <input value={nomesolicitante} onChange={e=>setNome(e.target.value)} placeholder="Nome do solicitante *"
                style={{...inp,border:`1px solid ${!nomesolicitante?B.vermelho+"66":B.begeDeep}`}}/>
              <select value={solicitante} onChange={e=>setSolicitante(e.target.value)} style={{...inp,fontSize:12}}>
                {["Recepção","Camareira","Gerência","Manutenção"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          {fotoSolicitante&&(
            <button onClick={()=>setFoto("")} style={{marginTop:8,fontSize:11,color:B.vermelho,background:"none",border:"none",cursor:"pointer",padding:0}}>
              ✕ remover foto
            </button>
          )}
        </div>

        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,background:B.begeDeep,border:"none",borderRadius:10,padding:"12px",color:B.azulMid,fontWeight:700,fontSize:14,cursor:"pointer"}}>Cancelar</button>
          <button onClick={submit}
            style={{flex:2,background:ok?`linear-gradient(135deg,${B.verde},#3d8a72)`:B.begeDeep,border:"none",borderRadius:10,padding:"12px",color:ok?"#fff":B.azulMid,fontWeight:800,fontSize:14,cursor:ok?"pointer":"not-allowed"}}>
            ✓ Abrir OS
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({osList}){
  const pendentes=osList.filter(o=>o.status==="Pendente");
  const total=osList.length||1;
  const stats=[
    {label:"Total OS",val:osList.length,color:B.azul,icon:"📋"},
    {label:"Abertas",val:osList.filter(o=>o.status==="Aberto").length,color:B.azulLight,icon:"🔵"},
    {label:"Em Andamento",val:osList.filter(o=>o.status==="Em andamento").length,color:B.amarelo,icon:"🔧"},
    {label:"Pendentes",val:pendentes.length,color:B.vermelho,icon:"⏸️"},
    {label:"Concluídas",val:osList.filter(o=>o.status==="Concluído").length,color:B.verde,icon:"✅"},
    {label:"Paliativos",val:osList.filter(o=>o.status==="Paliativo").length,color:B.laranja,icon:"⚠️"},
    {label:"Unidades",val:osList.filter(o=>o.tipoArea==="unidade").length,color:B.azulMid,icon:"🏠"},
    {label:"Estruturas",val:osList.filter(o=>o.tipoArea==="estrutura").length,color:B.verdeLight,icon:"🏗️"},
  ];
  const porCat=CATEGORIAS.map(c=>({c,n:osList.filter(o=>o.categoria===c).length})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n);
  const porArea=[...new Map(osList.map(o=>[o.area,osList.filter(x=>x.area===o.area).length])).entries()].sort((a,b)=>b[1]-a[1]).slice(0,6);
  const satMap=osList.filter(o=>o.satisfacao).reduce((acc,o)=>{acc[o.satisfacao]=(acc[o.satisfacao]||0)+1;return acc;},{});
  const satTotal=Object.values(satMap).reduce((a,b)=>a+b,0)||1;
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        {stats.map(({label,val,color,icon})=>(
          <div key={label} style={{background:"#fff",borderRadius:14,padding:"14px 16px",border:`2px solid ${color}22`,boxShadow:`0 4px 20px ${color}11`}}>
            <div style={{fontSize:18,marginBottom:4}}>{icon}</div>
            <div style={{fontSize:28,fontWeight:900,color,fontFamily:"'DM Mono',monospace"}}>{val}</div>
            <div style={{fontSize:10,color:B.azulMid,marginTop:2,fontWeight:600}}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:"#fff",borderRadius:14,padding:18,border:`1px solid ${B.begeDeep}`}}>
          <div style={{fontSize:10,color:B.azulMid,fontWeight:700,marginBottom:14,letterSpacing:1}}>POR CATEGORIA</div>
          {porCat.map(({c,n})=>(<div key={c} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:B.azul}}>{c}</span><span style={{fontSize:12,color:B.verde,fontWeight:700}}>{n}</span></div><div style={{height:5,background:B.bege,borderRadius:4}}><div style={{height:5,background:`linear-gradient(90deg,${B.verde},${B.amarelo})`,borderRadius:4,width:`${(n/total)*100}%`}}/></div></div>))}
        </div>
        <div style={{background:"#fff",borderRadius:14,padding:18,border:`1px solid ${B.begeDeep}`}}>
          <div style={{fontSize:10,color:B.azulMid,fontWeight:700,marginBottom:14,letterSpacing:1}}>ÁREAS COM MAIS OS</div>
          {porArea.map(([area,n])=>(<div key={area} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${B.bege}`}}><span style={{fontSize:13,color:B.azul}}>{area}</span><span style={{background:`${B.azul}11`,color:B.azul,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{n} OS</span></div>))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{background:"#fff",borderRadius:14,padding:18,border:`2px solid ${B.vermelho}22`}}>
          <div style={{fontSize:10,color:B.vermelho,fontWeight:700,marginBottom:14,letterSpacing:1}}>⏸️ PENDÊNCIAS ABERTAS</div>
          {pendentes.length===0?<div style={{color:B.azulMid,fontSize:13}}>Nenhuma OS pendente ✅</div>:pendentes.map(o=>(<div key={o.id} style={{marginBottom:8,padding:"8px 10px",background:B.bege,borderRadius:8,border:`1px solid ${B.begeDeep}`}}><div style={{fontSize:12,fontWeight:700,color:B.azul}}>{o.area}</div><div style={{fontSize:11,color:B.vermelho,marginTop:2}}>{o.motivoPendencia||"Motivo não informado"}</div></div>))}
        </div>
        <div style={{background:"#fff",borderRadius:14,padding:18,border:`2px solid ${B.verde}22`}}>
          <div style={{fontSize:10,color:B.verde,fontWeight:700,marginBottom:14,letterSpacing:1}}>⭐ SATISFAÇÃO DOS HÓSPEDES</div>
          {Object.keys(satMap).length===0?<div style={{color:B.azulMid,fontSize:13}}>Nenhum registro ainda</div>:SATISFACAO_OPTS.filter(s=>satMap[s]).map(s=>(<div key={s} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><span style={{fontSize:18}}>{SATISFACAO_ICON[s]}</span><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,color:B.azul,fontWeight:600}}>{s}</span><span style={{fontSize:12,color:SATISFACAO_COLOR[s],fontWeight:700}}>{satMap[s]}</span></div><div style={{height:5,background:B.bege,borderRadius:4}}><div style={{height:5,background:SATISFACAO_COLOR[s],borderRadius:4,width:`${(satMap[s]/satTotal)*100}%`}}/></div></div></div>))}
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [perfil,setPerfil]=useState(null);
  const [aba,setAba]=useState("os");
  const [osList,setOsList]=useState(INITIAL_OS);
  const [filtroStatus,setFS]=useState("Todos");
  const [filtroPrio,setFP]=useState("Todas");
  const [filtroTipo,setFT]=useState("Todos");
  const [busca,setBusca]=useState("");
  const [vista,setVista]=useState("normal");
  const [modalOS,setModalOS]=useState(null);
  const [novaOSOpen,setNova]=useState(false);

  useEffect(()=>{
    const l=document.createElement("link");
    l.href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap";
    l.rel="stylesheet";document.head.appendChild(l);
    document.body.style.margin="0";document.body.style.background=B.bege;
  },[]);

  const filtrados=osList.filter(o=>{
    if(vista==="pendentes")return o.status==="Pendente";
    if(vista==="satisfacao")return["Concluído","Paliativo"].includes(o.status);
    if(filtroStatus!=="Todos"&&o.status!==filtroStatus)return false;
    if(filtroPrio!=="Todas"&&o.prioridade!==filtroPrio)return false;
    if(filtroTipo!=="Todos"&&o.tipoArea!==filtroTipo)return false;
    if(busca&&![o.area,o.descricao,o.categoria,o.nomesolicitante].some(f=>(f||"").toLowerCase().includes(busca.toLowerCase())))return false;
    if(perfil==="Manutenção"&&o.status==="Concluído")return false;
    return true;
  }).sort((a,b)=>{const p={Urgente:0,Alta:1,Média:2,Baixa:3};return p[a.prioridade]-p[b.prioridade]||new Date(b.dataCriacao)-new Date(a.dataCriacao);});

  const qPend=osList.filter(o=>o.status==="Pendente").length;
  const qSat=osList.filter(o=>["Concluído","Paliativo"].includes(o.status)&&!o.contatoSatisfacao).length;

  const BtnVista=({v,label,cor,badge})=>(
    <button onClick={()=>setVista(v)} style={{padding:"8px 16px",borderRadius:10,border:`2px solid ${vista===v?cor:B.begeDeep}`,background:vista===v?`${cor}11`:"#fff",color:vista===v?cor:B.azulMid,fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.15s"}}>
      {label}{badge>0&&<span style={{background:cor,color:cor===B.amarelo?B.azul:"#fff",borderRadius:20,padding:"1px 7px",fontSize:11,minWidth:18,textAlign:"center"}}>{badge}</span>}
    </button>
  );

  if(!perfil)return(
    <div style={{minHeight:"100vh",background:B.azul,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-60,left:"50%",transform:"translateX(-50%)",opacity:0.06}}><SunLogo size={500}/></div>
      <div style={{textAlign:"center",maxWidth:440,width:"100%",position:"relative",zIndex:1}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:36}}>
          <SunLogo size={72}/>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:800,color:B.branco,lineHeight:1.1,marginTop:12}}>China Park</div>
          <div style={{fontSize:13,fontWeight:700,color:B.verde,letterSpacing:4,marginTop:2}}>ECO RESORT</div>
          <div style={{width:40,height:2,background:`linear-gradient(90deg,${B.vermelho},${B.amarelo},${B.verde})`,borderRadius:2,margin:"14px auto 6px"}}/>
          <div style={{fontSize:12,color:"#ffffff66",letterSpacing:2,fontWeight:500}}>SISTEMA DE MANUTENÇÃO</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {["Recepção","Camareira","Gerência","Manutenção"].map(p=>(
            <button key={p} onClick={()=>setPerfil(p)}
              style={{background:"#ffffff0d",border:"1px solid #ffffff1a",borderRadius:14,padding:"16px 22px",color:B.branco,fontSize:15,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="#ffffff1a";e.currentTarget.style.borderColor=B.verde;}}
              onMouseLeave={e=>{e.currentTarget.style.background="#ffffff0d";e.currentTarget.style.borderColor="#ffffff1a";}}>
              <span style={{fontSize:26,minWidth:32,textAlign:"center"}}>{PERFIL_ICON[p]}</span>
              <div style={{flex:1}}><div style={{fontWeight:700}}>{p}</div><div style={{fontSize:11,color:"#ffffff66",marginTop:2}}>{PERFIL_DESC[p]}</div></div>
              <span style={{color:B.verde,fontSize:18}}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:B.bege,fontFamily:"'DM Sans',sans-serif",color:B.azul}}>
      <div style={{background:B.azul,padding:"0 20px",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 20px #2F385533"}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"flex",alignItems:"center",gap:14,height:58}}>
          <SunLogo size={30}/>
          <div><div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:800,fontSize:17,color:B.branco,lineHeight:1}}>China Park</div><div style={{fontSize:9,color:B.verde,letterSpacing:2.5,fontWeight:700}}>ECO RESORT</div></div>
          <div style={{width:1,height:28,background:"#ffffff22",margin:"0 4px"}}/>
          <div style={{flex:1,display:"flex",gap:4}}>
            {(perfil==="Gerência"?["os","dashboard"]:["os"]).map(a=>(
              <button key={a} onClick={()=>{setAba(a);setVista("normal");}}
                style={{background:aba===a?`${B.verde}22`:"transparent",border:aba===a?`1px solid ${B.verde}55`:"1px solid transparent",color:aba===a?B.verde:"#ffffff66",borderRadius:8,padding:"5px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>
                {a==="os"?"📋 Ordens de Serviço":"📊 Dashboard"}
              </button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",background:"#ffffff11",borderRadius:20,border:"1px solid #ffffff22"}}>
            <span>{PERFIL_ICON[perfil]}</span>
            <span style={{fontSize:12,color:"#ffffffcc",fontWeight:600}}>{perfil}</span>
            <button onClick={()=>{setPerfil(null);setAba("os");setVista("normal");}} style={{background:"none",border:"none",color:"#ffffff66",cursor:"pointer",fontSize:14,marginLeft:4}}>✕</button>
          </div>
        </div>
      </div>
      <div style={{height:3,background:`linear-gradient(90deg,${B.vermelho},${B.amarelo},${B.verde},${B.azulLight})`}}/>

      <div style={{maxWidth:1000,margin:"0 auto",padding:"20px 16px"}}>
        {aba==="dashboard"&&perfil==="Gerência"?<Dashboard osList={osList}/>:(
          <>
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
              <BtnVista v="normal" label="📋 Todas as OS" cor={B.azul} badge={0}/>
              {(perfil==="Gerência"||perfil==="Manutenção")&&<BtnVista v="pendentes" label="⏸️ Pendentes" cor={B.vermelho} badge={qPend}/>}
              {(perfil==="Gerência"||perfil==="Recepção")&&<BtnVista v="satisfacao" label="⭐ Manutenções Resolvidas" cor={B.verde} badge={qSat}/>}
              <button onClick={()=>setNova(true)} style={{marginLeft:"auto",background:`linear-gradient(135deg,${B.verde},#3d8a72)`,border:"none",borderRadius:10,padding:"9px 20px",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer",boxShadow:`0 4px 14px ${B.verde}44`,whiteSpace:"nowrap"}}>+ Nova OS</button>
            </div>

            {vista==="pendentes"&&(
              <div style={{background:`${B.vermelho}11`,borderRadius:12,padding:"12px 16px",marginBottom:16,border:`1px solid ${B.vermelho}33`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:14,fontWeight:700,color:B.vermelho}}>⏸️ Manutenções Pendentes</div><div style={{fontSize:12,color:B.azulMid,marginTop:2}}>OS aguardando resolução — falta de material, mão de obra ou outro motivo</div></div>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:24,fontWeight:900,color:B.vermelho}}>{qPend}</span>
              </div>
            )}
            {vista==="satisfacao"&&(
              <div style={{background:`${B.verde}11`,borderRadius:12,padding:"12px 16px",marginBottom:16,border:`1px solid ${B.verde}33`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:14,fontWeight:700,color:B.verde}}>⭐ Manutenções Resolvidas — Satisfação do Hóspede</div><div style={{fontSize:12,color:B.azulMid,marginTop:2}}>Clique em uma OS para registrar o nível de satisfação</div></div>
                {qSat>0&&<span style={{background:B.amarelo,color:B.azul,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{qSat} aguardando</span>}
              </div>
            )}
            {vista==="normal"&&(
              <div style={{background:"#fff",borderRadius:14,padding:14,marginBottom:16,border:`1px solid ${B.begeDeep}`,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",boxShadow:"0 2px 12px #2F385508"}}>
                <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔍 Buscar por área, solicitante..." style={{flex:"1 1 180px",background:B.bege,border:`1px solid ${B.begeDeep}`,borderRadius:8,padding:"8px 12px",color:B.azul,fontSize:13}}/>
                <select value={filtroTipo} onChange={e=>setFT(e.target.value)} style={{background:B.bege,border:`1px solid ${B.begeDeep}`,borderRadius:8,padding:"8px 12px",color:B.azul,fontSize:12}}>
                  <option value="Todos">🏠🏗️ Todas</option><option value="unidade">🏠 Unidade</option><option value="estrutura">🏗️ Estrutura</option>
                </select>
                <select value={filtroStatus} onChange={e=>setFS(e.target.value)} style={{background:B.bege,border:`1px solid ${B.begeDeep}`,borderRadius:8,padding:"8px 12px",color:B.azul,fontSize:12}}>
                  {["Todos","Aberto","Em andamento","Pendente","Concluído","Paliativo"].map(o=><option key={o}>{o}</option>)}
                </select>
                <select value={filtroPrio} onChange={e=>setFP(e.target.value)} style={{background:B.bege,border:`1px solid ${B.begeDeep}`,borderRadius:8,padding:"8px 12px",color:B.azul,fontSize:12}}>
                  {["Todas","Urgente","Alta","Média","Baixa"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            )}

            <div style={{fontSize:11,color:B.azulMid,marginBottom:12,fontFamily:"'DM Mono',monospace",letterSpacing:0.5}}>{filtrados.length} ordem{filtrados.length!==1?"s":""} de serviço</div>

            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {filtrados.length===0&&(
                <div style={{textAlign:"center",padding:48,color:B.azulMid,background:"#fff",borderRadius:14,border:`1px solid ${B.begeDeep}`}}>
                  <div style={{fontSize:36,marginBottom:10}}>✅</div><div style={{fontWeight:600}}>Nenhuma OS encontrada</div>
                </div>
              )}
              {filtrados.map(os=>(
                <div key={os.id} onClick={()=>setModalOS(os)}
                  style={{background:"#fff",border:`1px solid ${B.begeDeep}`,borderLeft:`4px solid ${prioColor[os.prioridade]}`,borderRadius:"0 12px 12px 0",padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,boxShadow:"0 2px 8px #2F385506",transition:"all 0.15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 20px #2F385514";e.currentTarget.style.transform="translateX(2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 8px #2F385506";e.currentTarget.style.transform="none";}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:B.azulMid,minWidth:40,letterSpacing:0.5}}>#{String(os.id).padStart(4,"0")}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,fontSize:14,color:B.azul,fontFamily:"'Cormorant Garamond',serif"}}>{os.area}</span>
                      <span style={{fontSize:11,color:B.azulMid}}>·</span>
                      <span style={{fontSize:12,color:B.azulMid}}>{os.categoria}</span>
                      <TipoBadge tipo={os.tipoArea}/>
                      {os.recorrente&&<span style={{fontSize:10,color:B.vermelho,background:`${B.vermelho}11`,padding:"1px 7px",borderRadius:10,border:`1px solid ${B.vermelho}33`,fontWeight:700}}>RECORRENTE</span>}
                      {os.satisfacao&&<span style={{fontSize:14}} title={`Satisfação: ${os.satisfacao}`}>{SATISFACAO_ICON[os.satisfacao]}</span>}
                    </div>
                    <div style={{fontSize:13,color:B.azulMid,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{os.descricao}</div>
                    <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
                      <StatusBadge status={os.status}/><PrioBadge p={os.prioridade}/>
                      <span style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:B.azulMid}}>
                        {os.fotoSolicitante&&<img src={os.fotoSolicitante} style={{width:18,height:18,borderRadius:"50%",objectFit:"cover",border:`1.5px solid ${B.verde}`}} alt=""/>}
                        {os.nomesolicitante&&`👤 ${os.nomesolicitante}`}
                      </span>
                      {os.responsavel&&<span style={{fontSize:11,color:B.azulMid}}>🔧 {os.responsavel}</span>}
                      {os.status==="Pendente"&&os.motivoPendencia&&<span style={{fontSize:10,color:B.vermelho,background:`${B.vermelho}11`,padding:"1px 7px",borderRadius:10,fontWeight:600}}>⏸ {os.motivoPendencia}</span>}
                      <span style={{fontSize:11,color:B.azulMid,marginLeft:"auto"}}>{timeAgo(os.dataCriacao)}</span>
                    </div>
                  </div>
                  <span style={{color:B.azulMid,fontSize:18}}>›</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {modalOS&&<Modal os={modalOS} onClose={()=>setModalOS(null)} perfil={perfil} onUpdate={u=>{setOsList(l=>l.map(o=>o.id===u.id?u:o));setModalOS(null);}}/>}
      {novaOSOpen&&<NovaOS perfil={perfil} onClose={()=>setNova(false)} onCriar={nova=>{setOsList(l=>[nova,...l]);setNova(false);}}/>}
    </div>
  );
}
