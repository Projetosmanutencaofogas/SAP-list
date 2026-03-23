import React, { useState, useEffect, useRef } from 'react';
import { 
  ClipboardCopy, 
  Wand2, 
  Settings2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Upload, 
  X, 
  FileText, 
  Image as ImageIcon, 
  SlidersHorizontal, 
  Wrench, 
  ShoppingCart, 
  RotateCcw, 
  Trash2, 
  Mail, 
  Send,
  Eye,
  Edit3,
  ChevronRight,
  ChevronDown,
  Info,
  Zap,
  MousePointer2,
  Calculator,
  Copy,
  HelpCircle,
  Sparkles,
  Brain,
  Lightbulb,
  History,
  Search,
  ExternalLink,
  Package,
  MessageCircle,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

// --- Constants & Types ---

const SAP_UNITS_OF_MEASURE = `
% - Porcentagem
%O - Permilagem
D - Dias
CMS - Centímetros/segundo
000 - Metros/minuto
µL - Microlitro
µF - Microfarad
IF - Picofarad
GOH - Gigaohm
GM3 - Gramas/metro cúbico
ACR - Acre
KD3 - Quilogramas/decímetro cúbico
KML - Kilomol
KN - Kilonewton
MN - Meganewton
MGO - Megaohm
MGV - Megavolt
µA - Microampère
SAC - Saco
BB - Bombona
BD - Balde
BL - Bloco
GR - Garrafa
BR - Barra
BS - Bisnaga
MF - Milifarad
M/M - Mol por metro cúbico
M/L - Mol por litro
NA - Nanoampère
C3S - Centímetros cúbicos/segundo
NF - Nanofarad
NMM - Newton/milímetro quadrado
CM3 - Centímetro cúbico
CD3 - Decímetro cúbico
CJ - Conjunto
CM - Centímetro
CM2 - Centímetro quadrado
CR - Cartela
CRG - Carga
CXT - Caixote
CT - Cento
CL - Centilitro
CV - Cavalo à vapor
CX2 - Caixa
A/V - Siemens por metro
TOM - Toneladas/metro cúbico
VA - Voltampere
GRA - Graus
DM - Decímetro
TAM - Tambor
DZ - Dúzia
CDA - Cada
UE - Unidades enzima
EM - Embalagem
EML - Unidades enzima/mililitro
FD - FARDO
FL - Folha
FR - FRASCO
PÉS - Pés
PÉ2 - Pés quadrados
PÉ3 - Pé cúbico
G - Grama
GIL - Grama IngrAtivo / litro
GAL - Galão
GAU - Grama ouro
GJ - Gigajoule
GL - Galão
GLI - Gramas/litros
GUS - Galão EUA
GPM - Galões por milha (US)
GM - Gramas/mol
GM2 - Gramas/metro quadrado
GPH - Galões por hora (US)
µGQ - Microgramas/metro cúbico
MAI - Maiúsculas
GRZ - Groza
GIA - Grama - ingrediente ativo
H - Hora
HA - Hectares
HL - Hectolitro
POL - Polegada (inch)
"2 - Polegadas quadradas
"3 - Polegadas cúbicas
JG - Jogo
ANS - Anos (annum)
JKG - Joules/quilograma
JMO - Joule/mole
REC - Recipiente
CXC - Caixa de papelão
KG - Quilograma
KGM - Quilogramas/mol
KGS - Quilogramas/segundo
KGV - Quilogramas/metro cúbico
KGR - Quilograma - ingrediente ativo
CXA - CXA
KIT - KIT
KJK - Quilojoules/quilograma
KJM - Quilojoule/mole
KM - Quilômetro
KM2 - Quilômetro quadrado
KMH - Quilômetros/hora
KMN - Kelvin/minuto
KMS - Kelvin/segundo
KPA - Kilopascal
KT - Quilotoneladas
KVA - Quilovoltampère
KWK - kg ingrediente ativo / kg
L - Litro
LMI - Litros/minuto
LA - Latão
LB - Libra EUA
UA - Unidade de atividade
LCK - Litros por 100 km
LMS - Litros/molsegundo
LO - Latão
LPH - Litros por hora
LT - Litro
LTS - Litro
M - Metro
M/S - Metro/segundo
M2 - Metro quadrado
M-2 - 1 / metro quadrado
M2S - Metros quadrados/segundo
M3 - Metro cúbico
M3S - Metro cúbico/segundo
MEJ - Megajoule
MG - Miligrama
MGL - Miligrama/litro
MGQ - Miligramas/metro cúbico
MI - Milha
MI2 - Milhas quadradas
µM - Micrometro
MIN - Minuto
MIS - Microsegundos
ML - Mililitro
MLW - Mililitro - ingrediente ativo
MM - Milímetro
MM2 - Milímetros quadrados
MM3 - Milímetro cúbico
MNM - Milinewton/metro
MES - Meses
MPG - Milhas por galão (US)
MPS - Milipascal/segundos
M3H - Metro cúbico/hora
MS - Milisegundos
MS2 - Metro/segundo quadrado
MHR - Metros/hora
MTS - METRO
TCP - Megavoltampere
MWH - Megawatt hora
NAM - Nanômetro
NM - Newton/metro
NS - Nano-segundos
OZ - Onça
FOZ - Onça líquida EUA
P - Pontos
PAR - PAR
PAC - Pacote
PAL - Palete
PAS - Pascal-segundo
PEÇ - PEÇA
PL - Placa
PMI - 1/Minute
PPB - Partes por bilhões
PPM - Partes por milhão
PPT - Parts per trilhão
PRS - Núm.de pessoas
PS - Picosegundo
PT - Pinta líquida EUA
QT - Quarto, líquido EUA
RES - Resma
RHO - Grama/centímetro cúbico
RL - Função
ROL - Função
SC - SACO
PC - PEÇA
HRS - Horas
DIA - Dias
TB - Tambor
MIL - Milhares
TO - Tonelada
TON - Toneladas EUA
µGL - Micrograma/litro
UN - Unidade
UND - Unidade
MSC - Microsiemens por centímetro
CFM - Millimol por litro
VAL - Artigo de valor
VAS - Vasilhame
VB - Verbas
SMS - Semanas
YD - Jardas
YD2 - Jardas quadradas
YD3 - Jardas cúbicas
`;

const GL_ACCOUNTS_MAPPING = `
TABELA DE CONTAS DO RAZÃO (Sugira baseado na finalidade):
- 3411511: Taxas e Emolumentos
- 3430511: Confraternizações
- 3430521: Indenizações a Terceiros
- 3430531: Certificações - Obtenção e Manutenção
- 3430551: Associações e Sindicatos
- 4121001: Programa Alimentação do Trabalhador - Refeições
- 4121002: Programa Alimentação do Trabalhador-Cestas Básicas
- 4121011: Transporte - Vale Transporte
- 4121012: Transporte - Rotas
- 4121021: Assistência Médica
- 4121031: Seguro de Vida
- 4121041: Creche
- 4121051: Auxílio Funeral
- 4121061: Programa de Formação Profissional
- 4121071: Recreações
- 4121401: Outros Benefícios
- 4121501: Participações em Resultados
- 4121601: Indenizações Sentenças Trabalhistas
- 4130000: Combustíveis
- 4130001: Combustíveis - Interestaduais
- 4130002: Lubrificantes
- 4130011: Pneus e Câmaras
- 4130401: Outros Materiais de Operação
- 4130501: Materiais de Pintura
- 4130511: Materiais Elétricos
- 4130521: Materiais Obras Civis
- 4130531: Materiais Recuperação de Vasilhames
- 4130541: Peça e Materiais de Reposição
- 4130550: Peças e Materiais de Reposição - Infraestrutura TI
- 4130551: Partes e Acessórios
- 4130561: Ferramentas e Materiais de Oficina
- 4130571: Materiais Comercializáveis
- 4130901: Outros Materiais de Reposição, Manutenção e Repar
- 4131001: Fardamento
- 4131011: EPI'S - Equipamento de Proteção Individual
- 4131021: Materiais de Segurança
- 4131031: Materiais de Expediente
- 4131041: Materiais Copa e Cozinha
- 4131051: Materiais de Higiene e Limpeza
- 4131061: Materiais Comerciais e Promocionais
- 4131401: Outros Materiais de Consumo
- 4150000: Serviços de Manutenção Veículos - P. Físicas
- 4150001: Serviços de Manutenção Veículos - P. Jurídicas
- 4150010: Serviços de Manutenção Embarcações - P. Físicas
- 4150011: Serviços de Manutenção Embarcações - P. Jurídicas
- 4150020: Serviços de Manutenção Máq e Equip - P. Físicas
- 4150021: Serviços de Manutenção Máq Equipa - P. Jurídicas
- 4150030: Serviços de Manutenção Predial - P. Físicas
- 4150031: Serviços de Manutenção Predial - P. Jurídicas
- 4150201: Honorários Advoc Assessoria Jurídica - P. Físicas
- 4150202: Honorários Advoc Assessoria Jurídica P. Jurídicas
- 4150211: Serviços de Consultorias - P. Físicas
- 4150212: Serviços de Consultorias - P. Jurídicas
- 4150213: Serviços de Consultorias TI - P. Físicas
- 4150214: Serviços de Consultorias TI - P. Jurídicas
- 4150215: Serviços de Infraestrutura TI - P. Físicas
- 4150216: Serviços de Infraestrutura TI - P. Jurídicas
- 4150217: Serviços de Manutenção de Softwares - P. Físicas
- 4150218: Serviços de Manutenção de Softwares - P. Jurídicas
- 4150221: Serviços de Conservação e Limpeza - P. Física
- 4150222: Serviços de Conservação e Limpeza - P. Jurídica
- 4150225: Serviços de Coletas e de Análises - P. Físicas
- 4150226: Serviços de Coletas e de Análises - P. Jurídicas
- 4150231: Serviços de Vigil Transporte Valores - P. Físicas
- 4150232: Serviços de Vigil Transporte Val - P. Jurídicas
- 4150241: Serviços de Fretes e Carretos - P. Físicas
- 4150242: Serviços de Fretes e Carretos - P. Jurídicas
- 4150243: Serviços Fretes e Carret Abast. Filiais -P.Físicas
- 4150244: Serviços Fretes e Carret Abast.Filiais-P.Jurídicas
- 4150251: Serviços de Terceiros - P.Físicas
- 4150252: Serviços de Terceiros - P.Jurídicas
- 4150401: Aluguéis de Imóveis e Condomínios Pagos a P.Física
- 4150402: Aluguéis de Imóveis e Condomínios Pagos a P.Jurídi
- 4150403: Aluguéis de Máquinas e Equipamentos Pg. Pes Jurídi
- 4150404: Arrendamentos de Imóveis Pagos a P.Jurídicas
- 4150406: Aluguéis de Máquinas e Equipamentos Pg. Pes Física
- 4150410: Aluguéis de Bens Móveis Pg. a Pessoas Físicas
- 4150411: Aluguéis de Bens Móveis Pg. a Pessoas Jurídicas
- 4150421: Aluguéis de Softwares - P. Jurídicas
- 4150601: Propaganda e Publicidade em TV
- 4150602: Despesas c/ Promoção de Vendas - MAO
- 4150603: Festividades e Recepções
- 4150604: Feiras e Eventos
- 4150605: Patrocínios
- 4150606: Amostras Grátis
- 4150608: Propaganda e Publicidade na Internet
- 4150609: Propaganda e Publicidade em Rádio
- 4150610: Propaganda e Publicidade em Outras Mídias
- 4150612: Despesas c/ Promoção de Vendas - PVH
- 4150622: Despesas c/ Promoção de Vendas - RBO
- 4150632: Despesas c/ Promoção de Vendas - BVB
- 4150642: Despesas c/ Promoção de Vendas - STM
- 4150801: IPVA - Veículos
- 4150802: Demais taxas p/ Licenciamento de Veículos
- 4150803: Licenciamento de Embarcações
- 4150804: Seguro Obrigatório - Veículos/Embarcações
- 4150805: Seguro Facultativo - Veículos/Embarcações
- 4151001: Serviços de Telecomunicações - Telefonia
- 4151002: Energia Elétrica
- 4151003: Água e Esgoto
- 4151004: Locomoção Urbana
- 4151005: Despesas Cartorárias
- 4151006: Bens Duráveis Não Imobilizados
- 4151007: Lanches e Refeições
- 4151008: Correios e Malotes
- 4151009: Cópias Chaves etc e Reproduções
- 4151010: Jornais/Revistas/Periódicos
- 4151011: Anúncios e Publicações
- 4151012: Despachos Aduaneiros
- 4151013: Seguros
- 4151014: Passagens e Estadas - Passagens
- 4151015: Despesas c/ Importação
- 4151016: Despesas c/ Exportação
- 4151017: Custas Judiciais
- 4151018: Adequação Postos de Revenda
- 4151019: Serviços Fotográficos
- 4151020: Hospedagens - Hotéis e Afins
- 4151021: Diárias para Viagens
- 4151200: Aplicativo Fogás - Cartões
- 4151201: Outras Gastos e Despesas Gerais
- 4151301: Serviços de Telecomunicações - Internet
`;

const COLUMNS_SC = [
  { id: 'sta', label: 'Sta.' },
  { id: 'itemNum', label: 'Item' },
  { id: 'c', label: 'C' },
  { id: 'i', label: 'I' },
  { id: 'material', label: 'Material' },
  { id: 'textoBreve', label: 'Texto breve' },
  { id: 'quantidade', label: 'Quant.' },
  { id: 'um', label: 'UM' },
  { id: 'preco', label: 'Preço av.' },
  { id: 't', label: 'T' },
  { id: 'dtRemessa', label: 'Dt.remessa' },
  { id: 'grpMercads', label: 'GrpMercads.' },
  { id: 'centro', label: 'Centro' },
  { id: 'deposito', label: 'Depósito' },
  { id: 'gc', label: 'GC...' },
  { id: 'requisitante', label: 'Requisitante' },
  { id: 'setor', label: 'Setor' },
  { id: 'local', label: 'Local' }
];

const COLUMNS_OS = [
  { id: 'itemNum', label: 'Item' },
  { id: 'componente', label: 'Componente' },
  { id: 'denominacao', label: 'Denominação' },
  { id: 'tItem', label: 'T...' },
  { id: 'qtdNecess', label: 'Qtd.necess.' },
  { id: 'um', label: 'UM' },
  { id: 'ti', label: 'TI' },
  { id: 'e', label: 'E..' },
  { id: 'dep', label: 'Dep.' },
  { id: 'cen', label: 'Cen.' },
  { id: 'oper', label: 'Oper' },
  { id: 'lote', label: 'Lote' },
  { id: 'ctgSuprimento', label: 'Ctg.suprimento' },
  { id: 'recebedor', label: 'Recebedor' },
  { id: 'ptoDescarga', label: 'Pto.descarga' },
  { id: 'setor', label: 'Setor' },
  { id: 'local', label: 'Local' }
];

const COLUMNS_PC = [
  { id: 'sta', label: 'S..' },
  { id: 'itemNum', label: 'Itm' },
  { id: 'c', label: 'C' },
  { id: 'i', label: 'I' },
  { id: 'material', label: 'Material' },
  { id: 'textoBreve', label: 'Texto breve' },
  { id: 'qtdPedido', label: 'Qtd.pedido' },
  { id: 'um', label: 'UM' },
  { id: 'precoLiq', label: 'Preço líq.' },
  { id: 'moeda', label: 'Moeda' },
  { id: 'por', label: 'por' },
  { id: 'unidade', label: 'U..' },
  { id: 't', label: 'T' },
  { id: 'dtRemessa', label: 'Dt.remessa' },
  { id: 'grpMercads', label: 'GrpMercads.' },
  { id: 'centro', label: 'Cen.' },
  { id: 'setor', label: 'Setor' },
  { id: 'local', label: 'Local' }
];

const SMART_SUGGESTIONS = [
  "A IA processa em 15 segundos o que levaria 10 minutos de digitação manual.",
  "Escalabilidade: 1 Pedido Manual no SAP = 1 Semana de demandas processadas pela IA.",
  "O SAP Smart Assistant reduz o tempo de lançamento em até 92% por lote de itens.",
  "Você pode colar um print diretamente com Ctrl+V para extração instantânea.",
  "Arraste uma NFS-e e um orçamento juntos para cruzar os dados e gerar itens detalhados.",
  "Use o 'Copiar Lote' para preencher o grid do SAP 10 vezes mais rápido e sem erros.",
  "A IA entende listas escritas à mão se a foto estiver nítida e bem iluminada.",
  "O formato de e-mail gera automaticamente o texto para cotação com todos os itens.",
  "Ajuste o 'Modelo Material' para preencher o código base (Reposi, Imobil) automaticamente.",
  "O sistema remove automaticamente impostos (ISS, IRRF) das notas fiscais de serviço.",
  "O 'SAP Grid-Lock' garante que as colunas copiadas batam exatamente com o seu layout no SAP.",
  "INSIGHT: O tempo que você gastaria em um pedido manual, a IA processa uma semana inteira de demandas."
];

type TabType = 'sc' | 'os' | 'pc' | 'email' | 'auth' | 'saida' | 'recebimento';

// --- Components ---

// --- Helper Functions ---

/**
 * Formata um valor numérico para o padrão SAP Brasil (vírgula como decimal, sem separador de milhar)
 */
const formatSAPPrice = (priceStr: string): string => {
  if (!priceStr) return '1,00';
  
  // Remove espaços e símbolos monetários comuns
  let clean = priceStr.replace(/[R$\s]/g, '').trim();
  
  // Se estiver vazio após a limpeza
  if (!clean) return '1,00';

  // Se o valor for zero, retorna o padrão 1,00
  const normalized = clean.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(normalized);
  if (!isNaN(num) && num === 0) return '1,00';

  // Caso 1: Formato 1.234,56 (BR com milhar) -> 1234,56
  if (clean.includes('.') && clean.includes(',')) {
    const lastDot = clean.lastIndexOf('.');
    const lastComma = clean.lastIndexOf(',');
    if (lastDot < lastComma) {
      return clean.replace(/\./g, '');
    } else {
      // Caso 2: Formato 1,234.56 (US com milhar) -> 1234,56
      return clean.replace(/,/g, '').replace(/\./, ',');
    }
  }
  
  // Caso 3: Apenas vírgula 1234,56 -> Mantém
  if (clean.includes(',')) {
    return clean;
  }
  
  // Caso 4: Apenas ponto 326.87 -> 326,87
  if (clean.includes('.')) {
    // Se houver apenas um ponto, tratamos como decimal
    return clean.replace(/\./, ',');
  }
  
  // Caso 5: Inteiro 1234 -> 1234
  return clean;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('sc');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [processingStats, setProcessingStats] = useState<{
    items: number;
    manualTime: number;
    aiTime: number;
    efficiency: number;
  } | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [rawAiData, setRawAiData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showCopyConfig, setShowCopyConfig] = useState(false);
  const [copiedCount, setCopiedCount] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('sap_assistant_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, []);

  const addToHistory = (data: any[]) => {
    const newItem = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: data,
      count: data.length
    };
    const newHistory = [newItem, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('sap_assistant_history', JSON.stringify(newHistory));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIdx(prev => (prev + 1) % SMART_SUGGESTIONS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [config, setConfig] = useState({
    centro: '0100',
    gc: '107',
    requisitante: '',
    dtRemessa: '',
    codigoC: 'K',
    materialBase: '', 
    preco: '1,00',
    loteTamanho: 10
  });

  const materialModels = [
    { id: 'ALIMEN', label: 'ALIMEN (Alimentos)' },
    { id: 'EXPEDI', label: 'EXPEDI (Expediente)' },
    { id: 'LIMPEZ', label: 'LIMPEZ (Limpeza)' },
    { id: 'COZINH', label: 'COZINH (Copa/Cozinha)' },
    { id: 'INFORM', label: 'INFORM (Informática)' },
    { id: 'COMBUS', label: 'COMBUS (Combustíveis)' },
    { id: 'OBRASC', label: 'OBRASC (Obras Civis)' },
    { id: 'REPOSI', label: 'REPOSI (Reposição)' },
    { id: 'FARDAM', label: 'FARDAM (Fardamentos)' },
    { id: 'EQEPIS', label: 'EQEPIS (EPIs)' },
    { id: 'FERRAM', label: 'FERRAM (Ferramentas)' },
    { id: 'IMOBIL', label: 'IMOBIL (Imobilizado)' },
    { id: 'PUBLIC', label: 'PUBLIC (PÚBLICO)' },
    { id: 'PROMOC', label: 'PROMOC (PROMOÇÃO)' },
    { id: 'MANUTE', label: 'MANUTE (MANUTENÇÃO)' },
    { id: 'CONTRA', label: 'CONTRA (APOIO/CONTRATOS)' },
    { id: 'ALUGUE', label: 'ALUGUE (ALUGUEL)' },
    { id: 'LICENC', label: 'LICENC (LICENÇA)' },
    { id: 'CONSUM', label: 'CONSUM (CONSUMO)' },
    { id: 'DIVERS', label: 'DIVERS (DIVERSOS)' },
    { id: 'SERVIC', label: 'SERVIC (Serviço Geral)' },
  ];

  const [emailConfig, setEmailConfig] = useState({
    to: 'laura@fogas.com.br, compras@fogas.com.br',
    cc: 'bruno.lamas@fogas.com.br, manutencao@fogas.com.br',
    subject: 'REQUISIÇÃO DE COMPRA , (                   )'
  });
  const [authRecipient, setAuthRecipient] = useState('');
  const [authSender, setAuthSender] = useState('Alex Rodrigues');
  const [customEmailBody, setCustomEmailBody] = useState<string | null>(null);
  
  // Saída de Materiais State
  const [saidaType, setSaidaType] = useState('PEÇAS');
  const [saidaFornecedor, setSaidaFornecedor] = useState('');
  const [saidaItems, setSaidaItems] = useState('');

  // Recebimento State
  const [rawRecebimentoText, setRawRecebimentoText] = useState('');
  const [formattedRecebimentoText, setFormattedRecebimentoText] = useState('');
  const [isProcessingRecebimento, setIsProcessingRecebimento] = useState(false);
  const [showRecebimentoUpload, setShowRecebimentoUpload] = useState(false);

  const [copyColumnsSC, setCopyColumnsSC] = useState(
    COLUMNS_SC.reduce((acc, col) => ({ ...acc, [col.id]: col.id !== 'sta' && col.id !== 'itemNum' && col.id !== 'setor' && col.id !== 'local' }), {} as Record<string, boolean>)
  );
  const [copyColumnsOS, setCopyColumnsOS] = useState(
    COLUMNS_OS.reduce((acc, col) => ({ ...acc, [col.id]: col.id !== 'itemNum' && col.id !== 'tItem' && col.id !== 'componente' && col.id !== 'setor' && col.id !== 'local' }), {} as Record<string, boolean>)
  );
  const [copyColumnsPC, setCopyColumnsPC] = useState(
    COLUMNS_PC.reduce((acc, col) => ({ ...acc, [col.id]: col.id !== 'sta' && col.id !== 'itemNum' && col.id !== 'setor' && col.id !== 'local' }), {} as Record<string, boolean>)
  );

  useEffect(() => {
    const data = new Date();
    data.setDate(data.getDate() + 14);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    setConfig(prev => ({ ...prev, dtRemessa: `${dia}.${mes}.${ano}` }));
  }, []);

  useEffect(() => {
    let timer: any;
    if (isProcessing) {
      setProcessingTime(0);
      timer = setInterval(() => {
        setProcessingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isProcessing]);

  useEffect(() => {
    if (processingStats) {
      const timer = setTimeout(() => {
        setProcessingStats(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [processingStats]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        setFiles(prev => [...prev, ...pastedFiles]);
        setSuccessMsg(`✅ ${pastedFiles.length} item(s) colado(s) do clipboard!`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer?.files;
      if (droppedFiles && droppedFiles.length > 0) {
        const newFiles = Array.from(droppedFiles);
        setFiles(prev => [...prev, ...newFiles]);
        setSuccessMsg(`✅ ${newFiles.length} arquivo(s) adicionado(s)!`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'sc' || activeTab === 'os' || activeTab === 'pc') {
      buildTableData(rawAiData, activeTab);
      setCopiedCount(0);
    }
  }, [activeTab, rawAiData, config]);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setInputText('');
    setFiles([]);
    setTableData([]);
    setRawAiData([]);
    setCopiedCount(0);
    setError(null);
    setRawRecebimentoText('');
    setFormattedRecebimentoText('');
    setShowRecebimentoUpload(false);
    setSuccessMsg('Dados limpos! Pronto para nova análise.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });

  const handleCellChange = (index: number, field: string, value: string) => {
    setTableData(prevData => prevData.map((row, i) => {
      if (i === index) {
        const updatedRow = { ...row, [field]: value };
        if (activeTab === 'sc' && field === 'um') {
          const unit = String(value).toUpperCase();
          // Extract base model from current material if config.materialBase is empty
          let baseModel = config.materialBase;
          if (!baseModel && row.material) {
            // Extract from "MODEL(UNIT)"
            const match = row.material.match(/^([A-Z]+)\(/);
            if (match) {
              baseModel = match[1];
            }
          }
          updatedRow.material = baseModel 
            ? `${baseModel.toUpperCase()}(${unit})` 
            : '';
        } else if (activeTab === 'os' && field === 'um') {
          const unit = String(value).toUpperCase();
          let baseModel = config.materialBase;
          if (!baseModel && row.componente) {
            const match = row.componente.match(/^([A-Z]+)\(/);
            if (match) {
              baseModel = match[1];
            }
          }
          updatedRow.componente = baseModel 
            ? `${baseModel.toUpperCase()}(${unit})` 
            : '';
        }
        return updatedRow;
      }
      return row;
    }));
  };

  const toggleCopyColumn = (colId: string) => {
    if (activeTab === 'sc') {
      setCopyColumnsSC(prev => ({ ...prev, [colId]: !prev[colId] }));
    } else if (activeTab === 'os') {
      setCopyColumnsOS(prev => ({ ...prev, [colId]: !prev[colId] }));
    } else if (activeTab === 'pc') {
      setCopyColumnsPC(prev => ({ ...prev, [colId]: !prev[colId] }));
    }
  };

  const buildTableData = (items: any[], tab: TabType) => {
    if (!items || items.length === 0) {
      setTableData([]);
      return;
    }

    if (tab === 'sc') {
      const generatedTable = items.map((item, idx) => {
        const unit = (item.unidade || 'UN').toUpperCase();
        const qty = formatSAPPrice(item.quantidade && item.quantidade > 0 ? item.quantidade.toString() : '1');
        const price = formatSAPPrice((item.preco && item.preco !== '0,00') ? item.preco : (config.preco || '1,00'));
        
        // Format material as MODEL(UNIT) without spaces
        const modelToUse = config.materialBase || item.modeloMaterial;
        const materialFormatted = modelToUse 
          ? `${modelToUse.toUpperCase()}(${unit})` 
          : '';

        return {
          sta: '🔴',
          itemNum: ((idx + 1) * 10).toString(),
          c: config.codigoC || '',
          i: '',
          material: materialFormatted,
          textoBreve: item.descricao || '',
          quantidade: qty,
          um: unit,
          preco: price,
          contaRazao: item.contaRazao || '',
          t: 'D',
          dtRemessa: config.dtRemessa || '',
          grpMercads: '',
          centro: config.centro || '',
          deposito: '',
          gc: config.gc || '',
          requisitante: config.requisitante || '',
          setor: item.setor || '',
          local: item.local || '',
        };
      });
      setTableData(generatedTable);
    } else if (tab === 'os') {
      const generatedTable = items.map((item, idx) => {
        const unit = (item.unidade || '').toUpperCase();
        const modelToUse = config.materialBase || item.modeloMaterial;
        const materialFormatted = modelToUse 
          ? `${modelToUse.toUpperCase()}(${unit})` 
          : '';

        return {
          itemNum: String((idx + 1) * 10).padStart(4, '0'),
          componente: materialFormatted,
          denominacao: item.descricao || '',
          contaRazao: item.contaRazao || '',
          tItem: '',
          qtdNecess: item.qtdNecess || (item.quantidade !== undefined ? formatSAPPrice(item.quantidade.toString()) : ''),
          um: unit,
          ti: '',
          e: '',
          dep: '',
          cen: '',
          oper: '',
          lote: '',
          ctgSuprimento: '',
          recebedor: config.requisitante || '',
          ptoDescarga: '',
          setor: item.setor || '',
          local: item.local || '',
        };
      });
      setTableData(generatedTable);
    } else if (tab === 'pc') {
      const generatedTable = items.map((item, idx) => {
        const unit = (item.unidade || 'UN').toUpperCase();
        const qty = formatSAPPrice(item.quantidade && item.quantidade > 0 ? item.quantidade.toString() : '1');
        const price = formatSAPPrice((item.preco && item.preco !== '0,00') ? item.preco : (config.preco || '1,00'));

        const modelToUse = config.materialBase || item.modeloMaterial;
        // For PC tab, do NOT include the unit in the material field
        const materialFormatted = modelToUse 
          ? modelToUse.toUpperCase()
          : '';

        return {
          sta: '',
          itemNum: ((idx + 1) * 10).toString(),
          c: config.codigoC || '',
          i: '',
          material: materialFormatted,
          textoBreve: `Sv. ${item.descricao || ''}`,
          qtdPedido: qty,
          um: unit,
          precoLiq: price,
          contaRazao: item.contaRazao || '',
          t: 'D',
          moeda: 'BRL',
          por: '1',
          unidade: unit,
          grpMercads: '',
          centro: config.centro || '',
          setor: item.setor || '',
          local: item.local || '',
        };
      });
      setTableData(generatedTable);
    }
  };

  const resizeImage = (file: File, maxWidth = 1200, maxHeight = 1200): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Reduced quality for speed
        resolve(dataUrl.split(',')[1]);
        URL.revokeObjectURL(img.src);
      };
      img.onerror = (e) => reject(e);
    });
  };

  const processWithAI = async (retryCount = 0) => {
    if (!inputText.trim() && files.length === 0) {
      setError('Por favor, cole algum texto ou anexe um ficheiro/foto com a lista de materiais.');
      return;
    }

    if (retryCount === 0) {
      setIsProcessing(true);
      setLoadingProgress(5);
      setLoadingStep('Preparando documentos...');
      setError(null);
      setSuccessMsg('');
      setProcessingStats(null);
      setTableData([]);
      setRawAiData([]);
    }

    const startTime = Date.now();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      setError('Configuração ausente: GEMINI_API_KEY.');
      setIsProcessing(false);
      return;
    }

    let progressInterval: any;
    try {
      const ai = new GoogleGenAI({ apiKey });
      const parts: any[] = [];
      
      if (inputText.trim()) {
        parts.push({ text: `TIPO DE DOCUMENTO SAP: ${activeTab.toUpperCase()}\nTEXTO PARA ANÁLISE:\n${inputText}` });
      }
      
      setLoadingProgress(15);
      setLoadingStep('Otimizando imagens...');
      
      // Parallelize image resizing for speed
      const imageParts = await Promise.all(files.map(async (file) => {
        try {
          const base64Data = await resizeImage(file, 1024, 1024);
          return {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg'
            }
          };
        } catch (err) {
          const base64Data = await fileToBase64(file);
          return {
            inlineData: {
              data: base64Data,
              mimeType: file.type
            }
          };
        }
      }));

      parts.push(...imageParts);
      setLoadingProgress(40);
      setLoadingStep('IA analisando dados (OCR + SAP Mapping)...');
      
      progressInterval = setInterval(() => {
        setLoadingProgress(prev => (prev < 85 ? prev + 1 : prev));
      }, 2000);
      
      const validSiglas = SAP_UNITS_OF_MEASURE.split('\n')
        .filter(l => l.includes(' - '))
        .map(l => l.split(' - ')[0].trim())
        .join(', ');

      const r3MappingPrompt = `
      TABELA R3 (Sugira o código baseado na descrição):
      - ALIMEN: Alimentos (açúcar, arroz, feijão, café, bebidas, carnes, etc) -> CONTA 4131041
      - EXPEDI: Expediente (canetas, papel, lápis, pastas, envelopes, etc) -> CONTA 4131031
      - LIMPEZ: Limpeza (papel higiênico, sabão, detergente, álcool, etc) -> CONTA 4131051
      - COZINH: Copa/Cozinha (pratos, talheres, panelas, copos, chaleiras, etc) -> CONTA 4131041
      - INFORM: Informática (toner, mouse, teclado, acessórios, etc) -> CONTA 4130550
      - COMBUS: Combustíveis (gasolina, diesel, lubrificantes, graxas, etc) -> CONTA 4130000
      - OBRASC: Obras Civis (cimento, areia, ferro, tintas, pregos, elétrico, etc) -> CONTA 4130521
      - REPOSI: Reposição (peças para veículos, máquinas, equipamentos) -> CONTA 4130541
      - FARDAM: Fardamentos (calças, camisas operacionais) -> CONTA 4131001
      - EQEPIS: EPIs (botas, capacetes, luvas, máscaras, óculos) -> CONTA 4131011
      - FERRAM: Ferramentas (chaves, alicates, martelo, trenas) -> CONTA 4130561
      
      MODELOS DE SERVIÇO (Use estes para Pedidos de Compra de Serviços):
      - PUBLIC: Publicidade, Promoções e Eventos -> CONTA 4150601, 4150608 ou 4150609
      - PROMOC: Promoção de Vendas -> CONTA 4150602 ou 4150612
      - MANUTE: Serviços de MANUTENÇÃO FÍSICA e RECUPERAÇÃO (máquinas, equipamentos, veículos, ar-condicionado) -> CONTA 4150001, 4150021 ou 4150031
      - CONTRA: Serviços de APOIO, Confecção de Uniformes (Sempre conta 4150252), Consultoria, TI, Limpeza, Fretes, Vigilância ou qualquer serviço que NÃO envolva manutenção física de ativos. -> CONTA 4150252
      - ALUGUE: Aluguéis e Arrendamentos -> CONTA 4150402 ou 4150403
      - LICENC: Licenças e Seguros -> CONTA 4150802 ou 4151013
      - CONSUM: Contas de Consumo (Água, Luz, Telefone, Internet) -> CONTA 4151001, 4151002 ou 4151003
      - DIVERS: Despesas Diversas (Lanches, Viagens, Correios, Cópias) -> CONTA 4151201
      `;

      const aiCallPromise = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts }],
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction: `Você é um assistente SAP especializado em MM/PM da Fogás.
          OBJETIVO: Extrair itens de materiais/serviços de documentos ou textos manuais.
          
          REGRAS DE UNIDADE DE MEDIDA (UM):
          - Use APENAS estas siglas SAP: ${validSiglas}
          - Mapeie unidades do documento para a sigla correta (ex: 'PR'->'PAR', 'UNID'->'UN', 'CX'->'CX2').
          
          ${r3MappingPrompt}
          
          ${GL_ACCOUNTS_MAPPING}
          
          REGRAS DE EXTRAÇÃO:
          - descricao: MAIÚSCULAS, BEM RESUMIDA (máximo 40 caracteres), sem códigos de barras, sem a unidade de medida no texto.
          - quantidade: Numérico. Padrão 1.
          - unidade: SIGLA SAP acima.
          - preco: Unitário. Se não houver valor no documento, use '1,00'. Calcule se necessário (Total/Qtd).
          - detalhes: Especificações, marcas, modelos e referências a pedidos anteriores ou observações relevantes.
          - setor: Identifique o setor de destino. Procure especialmente em campos de "OBS", "Observações" ou notas no rodapé do documento (ex: Requalificação, Produção, Manutenção).
          - local: Identifique o local ou equipamento específico. Procure especialmente em campos de "OBS", "Observações" ou notas no rodapé (ex: Lança 4, Carrossel P13, Válvula, s100).
          
          LÓGICA DE MAPPING POR ABA (MUITO IMPORTANTE):
          - Se o texto contiver múltiplos blocos de "local", "Equipamento" e "itens", extraia CADA item separadamente, associando-o ao seu respectivo local/equipamento.
          
          1. Se TIPO DE DOCUMENTO SAP = "PC" (Pedido de Compra de Serviço):
             - modeloMaterial: Use APENAS os MODELOS DE SERVIÇO (PÚBLICO, PROMOÇÃO, MANUTE, CONTRA, ALUGUEL, LICENÇA, CONSUMO, DIVERSOS).
             - IMPORTANTE: NÃO inclua a unidade de medida no campo modeloMaterial (ex: use 'MANUTE', nunca 'MANUTE(UN)').
             - REGRA DE OURO: 
               * Se for "MANUTENÇÃO", "RECUPERAÇÃO DE PEÇAS" ou "CONFECÇÃO DE PEÇAS TÉCNICAS", use "MANUTE" e conta "4150021".
               * Se for "CONFECÇÃO DE UNIFORMES" ou "COSTURA", use "CONTRA" e OBRIGATORIAMENTE a conta "4150252".
               * Se for "SERVIÇO DE APOIO", "LIMPEZA", "TI", use "CONTRA".
             - contaRazao: Use contas de SERVIÇOS (iniciadas em 415). 
               * Ex: 4150021 para manutenção/recuperação/confecção de peças de máquinas.
               * Ex: 4150252 para confecção de uniformes.
               * Ex: 4150001 para manutenção de veículos.
               * Ex: 4150222 para limpeza.
          
          2. Se TIPO DE DOCUMENTO SAP = "SC" (Solicitação de Compra de Material):
             - modeloMaterial: Use os MODELOS DE MATERIAL (REPOSI, FARDAM, EQEPIS, FERRAM, ALIMEN, EXPEDI, LIMPEZ, COZINH, INFORM, COMBUS, OBRASC).
             - contaRazao: Use contas de MATERIAIS (iniciadas em 413).
               * Ex: 4130541 para peças de reposição.
               * Ex: 4130551 para obras civis e materiais elétricos.
               * Ex: 4131011 para EPIs.
               * Ex: 4130501 para expediente.
          
          IMPORTANTE: Priorize itens detalhados de orçamentos. Ignore impostos.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              materiais: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    descricao: { type: Type.STRING },
                    quantidade: { type: Type.NUMBER },
                    unidade: { type: Type.STRING },
                    preco: { type: Type.STRING },
                    detalhes: { type: Type.STRING },
                    setor: { type: Type.STRING, description: "Setor de destino (ex: Requalificação, Produção)" },
                    local: { type: Type.STRING, description: "Local ou equipamento específico (ex: Válvula, s100)" },
                    modeloMaterial: { type: Type.STRING, description: "Código R3 sugerido" },
                    contaRazao: { type: Type.STRING, description: "Conta do Razão sugerida (Número + Descrição)" }
                  },
                  required: ["descricao", "quantidade", "unidade", "modeloMaterial", "contaRazao"]
                }
              }
            }
          }
        }
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('A IA demorou muito para responder. Tente novamente com uma imagem mais simples ou verifique sua conexão.')), 90000)
      );

      const result = await Promise.race([aiCallPromise, timeoutPromise]) as any;
      clearInterval(progressInterval);

      setLoadingProgress(90);
      setLoadingStep('Finalizando estruturação...');
      
      const text = result.text;
      if (!text) throw new Error('A IA não retornou dados.');

      const jsonResult = JSON.parse(text);
      if (jsonResult.materiais && Array.isArray(jsonResult.materiais) && jsonResult.materiais.length > 0) {
        const endTime = Date.now();
        const durationSeconds = Math.round((endTime - startTime) / 1000);
        
        setProcessingStats({
          items: jsonResult.materiais.length,
          manualTime: jsonResult.materiais.length * 45,
          aiTime: durationSeconds,
          efficiency: Math.round(((jsonResult.materiais.length * 45 - durationSeconds) / (jsonResult.materiais.length * 45)) * 100)
        });

        setRawAiData(jsonResult.materiais);
        addToHistory(jsonResult.materiais);
        setLoadingProgress(100);
        setSuccessMsg(`Concluído! ${jsonResult.materiais.length} itens processados.`);
        setTimeout(() => setSuccessMsg(''), 5000);
        setIsProcessing(false);
      } else {
        throw new Error('Nenhum material identificado.');
      }
    } catch (err: any) {
      if (progressInterval) clearInterval(progressInterval);
      console.error('Erro IA:', err);
      // Ensure processing state is reset on error
      setIsProcessing(false);
      
      if (retryCount < 1) {
        setLoadingStep('Falha na primeira tentativa. Tentando novamente...');
        setTimeout(() => processWithAI(retryCount + 1), 1500);
      } else {
        setError(err.message || 'Erro na análise. Verifique se a imagem está nítida.');
      }
    }
  };

  const groupItemsBySector = () => {
    const groups: Record<string, any[]> = {};
    tableData.forEach(item => {
      const sector = item.setor || 'Geral';
      if (!groups[sector]) groups[sector] = [];
      groups[sector].push(item);
    });
    return groups;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const generateSaidaText = () => {
    const greeting = getGreeting();
    let text = `${greeting} Portaria\n\n`;
    text += `Por favor, liberar a saída de ${saidaType.toLowerCase()}\n\n`;
    
    if (saidaFornecedor) {
      text += `Fornecedor: ${saidaFornecedor}\n\n`;
    }
    
    if (saidaItems) {
      text += `${saidaItems}\n\n`;
    }
    
    text += `Atenciosamente,\n\n`;
    text += `${authSender}`;
    
    return text;
  };

  const processRecebimento = async () => {
    if (!rawRecebimentoText.trim() && files.length === 0) {
      setError('Por favor, cole algum texto ou anexe um ficheiro/foto com a lista de recebimento.');
      return;
    }
    
    setIsProcessingRecebimento(true);
    setError(null);
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Chave da API do Gemini não configurada.");
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const parts: any[] = [];
      
      const prompt = `
        Você é um assistente que formata mensagens de recebimento de materiais.
        Eu vou te passar um texto com mensagens de chat ou imagens onde pessoas informam quais materiais chegaram e para quem são.
        
        Seu objetivo é extrair a lista de materiais e as pessoas, e formatar EXATAMENTE neste padrão:
        
        Bom dia! Equipe
        *Chegou materiais no recebimento Fogás*
        
        [Nome da Pessoa em Formato Título] - [Material 1, Material 2...]
        [Nome da Pessoa em Formato Título] - [Material 1, Material 2...]
        
        Regras:
        1. Ignore saudações, datas, horas e mensagens irrelevantes do texto original.
        2. Agrupe os materiais por pessoa, se a mesma pessoa for mencionada mais de uma vez.
        3. O nome da pessoa deve vir primeiro, seguido de um hífen, e depois os materiais.
        4. Coloque a primeira letra do nome da pessoa em maiúscula e o resto em minúscula (ex: ANDERSON -> Anderson).
        5. Não adicione nenhum texto extra além do formato solicitado.
        
        Texto original:
        ${rawRecebimentoText}
      `;
      
      parts.push({ text: prompt });

      if (files.length > 0) {
        const imageParts = await Promise.all(files.map(async (file) => {
          try {
            const base64Data = await resizeImage(file, 1024, 1024);
            return {
              inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg'
              }
            };
          } catch (err) {
            const base64Data = await fileToBase64(file);
            return {
              inlineData: {
                data: base64Data,
                mimeType: file.type
              }
            };
          }
        }));
        parts.push(...imageParts);
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts }],
      });
      
      if (response.text) {
        setFormattedRecebimentoText(response.text.trim());
      } else {
        throw new Error('Resposta vazia da IA');
      }
    } catch (err: any) {
      console.error('Erro ao processar recebimento:', err);
      setError('Erro ao formatar o texto. Tente novamente.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsProcessingRecebimento(false);
    }
  };

  const generateAuthText = () => {
    const groups = groupItemsBySector();
    let text = `Prezados${authRecipient ? ` (${authRecipient})` : ''},\n\n`;
    text += `Solicitamos autorização para os orçamentos detalhados abaixo:\n\n`;
    
    Object.entries(groups).forEach(([sector, items]) => {
      // Agrupar por local dentro do setor para seguir o formato solicitado
      const localGroups: Record<string, any[]> = {};
      items.forEach(i => {
        const loc = i.local || 'Não informado';
        if (!localGroups[loc]) localGroups[loc] = [];
        localGroups[loc].push(i);
      });

      Object.entries(localGroups).forEach(([local, localItems]) => {
        const totalValue = localItems.reduce((acc, i) => {
          const val = parseFloat((i.preco || i.precoLiq || '0').replace('.', '').replace(',', '.'));
          const qty = parseFloat((i.quantidade || i.qtdNecess || '1').toString().replace(',', '.'));
          return acc + (val * qty);
        }, 0);

        text += `Orçamento: ${sector.toUpperCase()}\n\n`;
        text += `- Local: ${local}\n`;
        text += `- Equipamento: ${local}\n`;
        
        const itemNames = localItems.map(i => i.textoBreve || i.denominacao || i.componente || i.descricao || 'Item');
        let itemsStr = '';
        if (itemNames.length === 1) {
          itemsStr = itemNames[0];
        } else if (itemNames.length > 1) {
          const last = itemNames.pop();
          itemsStr = `${itemNames.join(', ')} e ${last}`;
        }
        
        text += `- Itens: ${itemsStr}\n`;
        text += `- Valor: R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n`;
      });
    });
    
    text += `Fico no aguardo da aprovação para prosseguirmos.\n\n`;
    text += `Atenciosamente,\n\n`;
    text += `${authSender}`;
    
    return text;
  };

  const copyBatchToClipboard = () => {
    if (tableData.length === 0) return;

    const batchSize = Number(config.loteTamanho) || 10;
    const currentBatch = tableData.slice(copiedCount, copiedCount + batchSize);

    if (currentBatch.length === 0) return;

    let tsvData: string[] = [];

    if (activeTab === 'sc') {
      tsvData = currentBatch.map(row => {
        const rowData = [];
        if (copyColumnsSC.sta) rowData.push(String(row.sta || '').trim());
        if (copyColumnsSC.itemNum) rowData.push(String(row.itemNum || '').trim());
        rowData.push(copyColumnsSC.c ? String(row.c || '').trim() : '');
        rowData.push(copyColumnsSC.i ? String(row.i || '').trim() : '');
        rowData.push(copyColumnsSC.material ? String(row.material || '').trim() : '');
        rowData.push(copyColumnsSC.textoBreve ? String(row.textoBreve || '').trim() : '');
        rowData.push(copyColumnsSC.quantidade ? String(row.quantidade || '').trim() : '');
        rowData.push(copyColumnsSC.um ? String(row.um || '').trim() : '');
        rowData.push(copyColumnsSC.preco ? String(row.preco || '').trim() : '');
        rowData.push(copyColumnsSC.t ? String(row.t || '').trim() : '');
        rowData.push(copyColumnsSC.dtRemessa ? String(row.dtRemessa || '').trim() : '');
        rowData.push(copyColumnsSC.grpMercads ? String(row.grpMercads || '').trim() : '');
        rowData.push(copyColumnsSC.centro ? String(row.centro || '').trim() : '');
        rowData.push(copyColumnsSC.deposito ? String(row.deposito || '').trim() : '');
        rowData.push(copyColumnsSC.gc ? String(row.gc || '').trim() : '');
        rowData.push(copyColumnsSC.requisitante ? String(row.requisitante || '').trim() : '');
        return rowData.join('\t');
      });
    } else if (activeTab === 'os') {
      tsvData = currentBatch.map(row => {
        const rowData = [];
        if (copyColumnsOS.itemNum) rowData.push(String(row.itemNum || '').trim());
        rowData.push(copyColumnsOS.componente ? String(row.componente || '').trim() : '');
        rowData.push(copyColumnsOS.denominacao ? String(row.denominacao || '').trim() : '');
        if (copyColumnsOS.tItem) rowData.push(String(row.tItem || '').trim());
        rowData.push(copyColumnsOS.qtdNecess ? String(row.qtdNecess || '').trim() : '');
        rowData.push(copyColumnsOS.um ? String(row.um || '').trim() : '');
        rowData.push(copyColumnsOS.ti ? String(row.ti || '').trim() : '');
        rowData.push(copyColumnsOS.e ? String(row.e || '').trim() : '');
        rowData.push(copyColumnsOS.dep ? String(row.dep || '').trim() : '');
        rowData.push(copyColumnsOS.cen ? String(row.cen || '').trim() : '');
        rowData.push(copyColumnsOS.oper ? String(row.oper || '').trim() : '');
        rowData.push(copyColumnsOS.lote ? String(row.lote || '').trim() : '');
        rowData.push(copyColumnsOS.ctgSuprimento ? String(row.ctgSuprimento || '').trim() : '');
        rowData.push(copyColumnsOS.recebedor ? String(row.recebedor || '').trim() : '');
        rowData.push(copyColumnsOS.ptoDescarga ? String(row.ptoDescarga || '').trim() : '');
        return rowData.join('\t');
      });
    } else if (activeTab === 'pc') {
      tsvData = currentBatch.map(row => {
        const rowData = [];
        if (copyColumnsPC.sta) rowData.push(String(row.sta || '').trim());
        if (copyColumnsPC.itemNum) rowData.push(String(row.itemNum || '').trim());
        rowData.push(copyColumnsPC.c ? String(row.c || '').trim() : '');
        rowData.push(copyColumnsPC.i ? String(row.i || '').trim() : '');
        rowData.push(copyColumnsPC.material ? String(row.material || '').trim() : '');
        rowData.push(copyColumnsPC.textoBreve ? String(row.textoBreve || '').trim() : '');
        rowData.push(copyColumnsPC.qtdPedido ? String(row.qtdPedido || '').trim() : '');
        rowData.push(copyColumnsPC.um ? String(row.um || '').trim() : '');
        rowData.push(copyColumnsPC.precoLiq ? String(row.precoLiq || '').trim() : '');
        rowData.push(copyColumnsPC.moeda ? String(row.moeda || '').trim() : '');
        rowData.push(copyColumnsPC.por ? String(row.por || '').trim() : '');
        rowData.push(copyColumnsPC.unidade ? String(row.unidade || '').trim() : '');
        rowData.push(copyColumnsPC.t ? String(row.t || '').trim() : '');
        rowData.push(copyColumnsPC.dtRemessa ? String(row.dtRemessa || '').trim() : '');
        rowData.push(copyColumnsPC.grpMercads ? String(row.grpMercads || '').trim() : '');
        rowData.push(copyColumnsPC.centro ? String(row.centro || '').trim() : '');
        return rowData.join('\t');
      });
    }

    const finalString = tsvData.join('\n');
    navigator.clipboard.writeText(finalString).then(() => {
      const newlyCopiedCount = copiedCount + currentBatch.length;
      setCopiedCount(newlyCopiedCount);
      
      if (newlyCopiedCount >= tableData.length) {
         setSuccessMsg('✅ Todas as linhas foram copiadas!');
      } else {
         setSuccessMsg(`Lote copiado (${currentBatch.length} itens)!`);
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    }).catch((err) => {
      console.error('Erro ao copiar:', err);
      setError('Não foi possível copiar para a área de transferência. Verifique as permissões do navegador.');
    });
  };

  const copyAllToClipboard = () => {
    if (tableData.length === 0) return;

    let tsvData: string[] = [];

    if (activeTab === 'sc') {
      tsvData = tableData.map(row => {
        const rowData = [];
        if (copyColumnsSC.sta) rowData.push(String(row.sta || '').trim());
        if (copyColumnsSC.itemNum) rowData.push(String(row.itemNum || '').trim());
        rowData.push(copyColumnsSC.c ? String(row.c || '').trim() : '');
        rowData.push(copyColumnsSC.i ? String(row.i || '').trim() : '');
        rowData.push(copyColumnsSC.material ? String(row.material || '').trim() : '');
        rowData.push(copyColumnsSC.textoBreve ? String(row.textoBreve || '').trim() : '');
        rowData.push(copyColumnsSC.quantidade ? String(row.quantidade || '').trim() : '');
        rowData.push(copyColumnsSC.um ? String(row.um || '').trim() : '');
        rowData.push(copyColumnsSC.preco ? String(row.preco || '').trim() : '');
        rowData.push(copyColumnsSC.t ? String(row.t || '').trim() : '');
        rowData.push(copyColumnsSC.dtRemessa ? String(row.dtRemessa || '').trim() : '');
        rowData.push(copyColumnsSC.grpMercads ? String(row.grpMercads || '').trim() : '');
        rowData.push(copyColumnsSC.centro ? String(row.centro || '').trim() : '');
        rowData.push(copyColumnsSC.deposito ? String(row.deposito || '').trim() : '');
        rowData.push(copyColumnsSC.gc ? String(row.gc || '').trim() : '');
        rowData.push(copyColumnsSC.requisitante ? String(row.requisitante || '').trim() : '');
        return rowData.join('\t');
      });
    } else if (activeTab === 'os') {
      tsvData = tableData.map(row => {
        const rowData = [];
        if (copyColumnsOS.itemNum) rowData.push(String(row.itemNum || '').trim());
        rowData.push(copyColumnsOS.componente ? String(row.componente || '').trim() : '');
        rowData.push(copyColumnsOS.denominacao ? String(row.denominacao || '').trim() : '');
        if (copyColumnsOS.tItem) rowData.push(String(row.tItem || '').trim());
        rowData.push(copyColumnsOS.qtdNecess ? String(row.qtdNecess || '').trim() : '');
        rowData.push(copyColumnsOS.um ? String(row.um || '').trim() : '');
        rowData.push(copyColumnsOS.ti ? String(row.ti || '').trim() : '');
        rowData.push(copyColumnsOS.e ? String(row.e || '').trim() : '');
        rowData.push(copyColumnsOS.dep ? String(row.dep || '').trim() : '');
        rowData.push(copyColumnsOS.cen ? String(row.cen || '').trim() : '');
        rowData.push(copyColumnsOS.oper ? String(row.oper || '').trim() : '');
        rowData.push(copyColumnsOS.lote ? String(row.lote || '').trim() : '');
        rowData.push(copyColumnsOS.ctgSuprimento ? String(row.ctgSuprimento || '').trim() : '');
        rowData.push(copyColumnsOS.recebedor ? String(row.recebedor || '').trim() : '');
        rowData.push(copyColumnsOS.ptoDescarga ? String(row.ptoDescarga || '').trim() : '');
        return rowData.join('\t');
      });
    } else if (activeTab === 'pc') {
      tsvData = tableData.map(row => {
        const rowData = [];
        if (copyColumnsPC.sta) rowData.push(String(row.sta || '').trim());
        if (copyColumnsPC.itemNum) rowData.push(String(row.itemNum || '').trim());
        rowData.push(copyColumnsPC.c ? String(row.c || '').trim() : '');
        rowData.push(copyColumnsPC.i ? String(row.i || '').trim() : '');
        rowData.push(copyColumnsPC.material ? String(row.material || '').trim() : '');
        rowData.push(copyColumnsPC.textoBreve ? String(row.textoBreve || '').trim() : '');
        rowData.push(copyColumnsPC.qtdPedido ? String(row.qtdPedido || '').trim() : '');
        rowData.push(copyColumnsPC.um ? String(row.um || '').trim() : '');
        rowData.push(copyColumnsPC.precoLiq ? String(row.precoLiq || '').trim() : '');
        rowData.push(copyColumnsPC.moeda ? String(row.moeda || '').trim() : '');
        rowData.push(copyColumnsPC.por ? String(row.por || '').trim() : '');
        rowData.push(copyColumnsPC.unidade ? String(row.unidade || '').trim() : '');
        rowData.push(copyColumnsPC.t ? String(row.t || '').trim() : '');
        rowData.push(copyColumnsPC.dtRemessa ? String(row.dtRemessa || '').trim() : '');
        rowData.push(copyColumnsPC.grpMercads ? String(row.grpMercads || '').trim() : '');
        rowData.push(copyColumnsPC.centro ? String(row.centro || '').trim() : '');
        return rowData.join('\t');
      });
    }

    const finalString = tsvData.join('\n');
    navigator.clipboard.writeText(finalString).then(() => {
      setCopiedCount(tableData.length);
      setSuccessMsg('✅ Todas as linhas copiadas de uma vez!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }).catch((err) => {
      console.error('Erro ao copiar tudo:', err);
      setError('Erro ao copiar dados. Tente selecionar e copiar manualmente.');
    });
  };

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return 'Bom dia';
    if (hora >= 12 && hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const generatedEmailContent = tableData.length > 0 ? (
    `${getSaudacao()} Prezados,\n\nSolicitamos a cotação da RC (                 )\n\n` +
    tableData.map((item, idx) => {
      const itemName = item.textoBreve || item.denominacao || '';
      const itemQtd = item.quantidade || item.qtdNecess || '';
      const itemUm = item.um || '';
      const rawDetalhe = (rawAiData[idx]?.detalhes?.trim() || '')
        .replace(/SOLICITANTE:.*$/i, '')
        .replace(/SOLICITADO VIA.*$/i, '')
        .trim();
      const hasRealDetail = rawDetalhe && !['nenhum', 'n/a', ''].includes(rawDetalhe.toLowerCase());
      const detalhes = hasRealDetail ? `\n   ↳ Especificações: ${rawDetalhe}` : '';
      const local = item.local ? `\n   ↳ Local/Equipamento: ${item.local}` : '';
      const preco = (item.preco && item.preco !== '1,00' && item.preco !== '0,00') ? `\n   ↳ Preço Ref: R$ ${item.preco}` : '';
      return `• ${itemQtd} ${itemUm} - ${itemName}${detalhes}${local}${preco}`;
    }).join('\n\n') +
    `\n\nAtenciosamente,`
  ) : '';

  const handleSendEmail = (method: 'mailto' | 'gmail' = 'mailto') => {
    const rawBody = customEmailBody || generatedEmailContent;
    if (!rawBody) return;
    
    // Strip markdown for plain text email bodies
    const body = rawBody.replace(/\*\*/g, '');
    
    if (method === 'gmail') {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailConfig.to)}&cc=${encodeURIComponent(emailConfig.cc)}&su=${encodeURIComponent(emailConfig.subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank');
      setSuccessMsg('Abrindo Gmail...');
      setTimeout(() => setSuccessMsg(''), 4000);
      return;
    }

    // mailto has a limit of ~2000 characters in many browsers/clients
    if (body.length > 1800) {
      setError('O conteúdo é muito longo para abrir automaticamente no e-mail. Por favor, use o botão "Copiar Texto" e cole manualmente no seu e-mail.');
      setTimeout(() => setError(null), 6000);
      return;
    }
    
    const mailtoLink = `mailto:${emailConfig.to}?cc=${emailConfig.cc}&subject=${encodeURIComponent(emailConfig.subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const link = document.createElement('a');
      link.href = mailtoLink;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccessMsg('Abrindo o seu cliente de e-mail...');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Erro ao abrir mailto:', err);
      setError('Não foi possível abrir seu cliente de e-mail automaticamente. Tente copiar o texto e colar manualmente.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const currentColsDef = activeTab === 'sc' ? COLUMNS_SC : (activeTab === 'os' ? COLUMNS_OS : (activeTab === 'pc' ? COLUMNS_PC : []));
  const currentCopyColumns = activeTab === 'sc' ? copyColumnsSC : (activeTab === 'os' ? copyColumnsOS : (activeTab === 'pc' ? copyColumnsPC : {}));
  const hasMoreToCopy = tableData.length > 0 && copiedCount < tableData.length;
  const nextBatchEnd = Math.min(copiedCount + (Number(config.loteTamanho) || 10), tableData.length);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 relative">
      {/* New Professional Sticky Header */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-blue-600 text-white shadow-xl shadow-blue-900/10 overflow-hidden"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">SAP Smart Assistant</h1>
              <p className="text-[9px] font-bold text-blue-200 uppercase tracking-[0.3em] mt-1">Inteligência Operacional</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Sistema Ativo
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center text-white p-6 overflow-y-auto"
          >
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 w-full max-w-6xl py-12">
              
              {/* Main Progress Area */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative w-48 h-48 mb-12">
                  <motion.div 
                    animate={{ rotate: [0, -360] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-8 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain size={56} className="text-blue-400 animate-pulse" />
                  </div>
                  
                  {/* Progress Ring */}
                  <motion.div 
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="92"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-white/5"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="92"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray="578"
                        animate={{ strokeDashoffset: 578 - (578 * loadingProgress) / 100 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="text-blue-500"
                      />
                    </svg>
                  </motion.div>
                </div>
                
                <div className="text-center space-y-6 max-w-md w-full">
                  <div className="space-y-2">
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400"
                    >
                      A IA ESTÁ LENDO O DOCUMENTO...
                    </motion.h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">PROCESSAMENTO INTELIGENTE EM TEMPO REAL</p>
                  </div>

                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${loadingProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Loader2 size={14} className="animate-spin text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400/60">{loadingStep}</span>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={suggestionIdx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="pt-8"
                    >
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 space-y-3">
                        <div className="flex items-center justify-center gap-2 text-amber-400">
                          <Lightbulb size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Dica de Produtividade</span>
                        </div>
                        <p className="text-sm font-medium text-blue-50 italic leading-relaxed">
                          "{SMART_SUGGESTIONS[suggestionIdx]}"
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Side Stats Card */}
              <div className="w-full lg:w-80">
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 space-y-10 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={64} className="text-blue-400" />
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MousePointer2 size={14} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Tempo Manual</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-4xl font-black tabular-nums text-slate-300">
                        {Math.floor(processingTime * 8 / 60)}:{(processingTime * 8 % 60).toString().padStart(2, '0')}
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 italic">Estimativa de execução humana</p>
                    </div>
                  </div>
                  
                  <div className="h-px bg-white/10 w-full" />

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Brain size={14} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Tempo da IA</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-6xl font-black tabular-nums text-blue-400">{processingTime}</p>
                      <p className="text-xl font-black text-blue-400/60 uppercase italic">seg</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full w-fit">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">Processando em Tempo Real</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDragging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-blue-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-white p-10 pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center border-4 border-dashed border-white/40 animate-pulse">
                <Upload size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase tracking-tighter">Solte para Analisar</h2>
                <p className="text-xl font-medium text-blue-100">Arraste fotos, PDFs ou prints para extração automática</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6"
      >
        
        {/* Floating Action Button */}
        <AnimatePresence>
          {tableData.length > 0 && (
            <motion.div 
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              className="fixed bottom-8 right-8 z-[1000]"
            >
              <button 
                onClick={() => {
                  setTableData([]);
                  setRawAiData([]);
                  setInputText('');
                  setFiles([]);
                  setProcessingStats(null);
                  setSuccessMsg('Sessão reiniciada!');
                  setTimeout(() => setSuccessMsg(''), 3000);
                }}
                className="group flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-blue-600 transition-all active:scale-95 border border-white/10"
              >
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                  <RotateCcw size={18} />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Nova Análise</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guide Modal */}
        <AnimatePresence>
          {showGuide && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGuide(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />
                
                <div className="p-10 space-y-10">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Sparkles size={12} /> Onboarding Inteligente
                      </div>
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                        O QUE É O <span className="text-blue-600">ASSISTENTE?</span>
                      </h2>
                      <p className="text-slate-500 font-medium text-lg max-w-md">
                        Sua ponte inteligente entre documentos e o SAP, redesenhada para máxima performance.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowGuide(false)}
                      className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900 active:scale-90"
                    >
                      <X size={28} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Main Feature - Large Card */}
                    <div className="md:col-span-2 p-8 bg-slate-900 rounded-[2rem] text-white flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Brain size={160} />
                      </div>
                      <div className="space-y-4 relative z-10">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                          <Zap size={32} />
                        </div>
                        <h3 className="text-3xl font-bold tracking-tight">Visão Computacional de Elite</h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                          A IA lê fotos, PDFs e prints de propostas, extraindo itens e preços sem você digitar nada. 
                          <span className="text-blue-400 font-bold block mt-2">Suporta múltiplos arquivos simultâneos.</span>
                        </p>
                      </div>
                      <div className="mt-8 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <span>OCR Avançado</span>
                        <div className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span>Extração de Preços</span>
                        <div className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span>Auto-Mapeamento</span>
                      </div>
                    </div>

                    {/* Secondary Features - Stacked */}
                    <div className="space-y-4">
                      <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 group hover:bg-emerald-100 transition-colors">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                          <Calculator size={20} />
                        </div>
                        <h4 className="font-bold text-slate-900">Preços Inteligentes</h4>
                        <p className="text-[11px] text-slate-500 mt-1">Recálculo automático de preços unitários e ajuste de quantidades mínimas.</p>
                      </div>
                      <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 group hover:bg-indigo-100 transition-colors">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                          <Copy size={20} />
                        </div>
                        <h4 className="font-bold text-slate-900">Cópia em Lote</h4>
                        <p className="text-[11px] text-slate-500 mt-1">Copie blocos de 10 itens por vez e cole direto no grid do SAP.</p>
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-lg transition-all">
                      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:rotate-12 transition-transform">
                        <MousePointer2 className="text-blue-500" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Ctrl+V & Drag</h4>
                        <p className="text-[10px] text-slate-500">Cole prints direto na tela.</p>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-lg transition-all">
                      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:rotate-12 transition-transform">
                        <Mail className="text-rose-500" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">E-mail de Cotação</h4>
                        <p className="text-[10px] text-slate-500">Geração automática de texto.</p>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-lg transition-all">
                      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:rotate-12 transition-transform">
                        <CheckCircle2 className="text-sky-500" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Padronização</h4>
                        <p className="text-[10px] text-slate-500">Regras automáticas Fogás.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                        ))}
                      </div>
                      <p className="text-xs font-medium text-slate-500">
                        Usado por <span className="text-slate-900 font-bold">+50 usuários</span> da Fogás hoje.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowGuide(false)}
                      className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest text-xs"
                    >
                      Entendi, vamos começar!
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Smart Suggestion Feed */}
        <div className="mb-4 overflow-hidden h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={suggestionIdx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/60"
            >
              <Sparkles size={12} />
              {SMART_SUGGESTIONS[suggestionIdx]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white sticky top-4 z-50"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 relative group overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <FileSpreadsheet size={32} className="relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">SAP <span className="text-blue-600">Smart</span> Assistant</h1>
                <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-widest">v2.0</div>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Automação Inteligente MM & PM</p>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Sistemas Operacionais
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Real-time Stats */}
            <div className="hidden xl:flex items-center gap-6 px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tempo Salvo</p>
                <p className="text-sm font-black text-slate-900">~14.2h <span className="text-[10px] text-emerald-500 font-bold">/mês</span></p>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Precisão IA</p>
                <p className="text-sm font-black text-slate-900">99.4%</p>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <p className="text-[10px] font-black text-slate-900 uppercase">Online</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowGuide(true)}
                className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100"
                title="Como funciona?"
              >
                <HelpCircle size={22} />
              </button>
              
              <nav className="flex items-center gap-2">
                <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
                  {[
                    { id: 'sc', label: 'SC', icon: ShoppingCart },
                    { id: 'os', label: 'OS', icon: Wrench },
                    { id: 'pc', label: 'PC', icon: FileSpreadsheet },
                    { id: 'auth', label: 'Autorização', icon: CheckCircle2 },
                    { id: 'email', label: 'Email', icon: Mail }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                        activeTab === tab.id 
                          ? 'bg-white text-blue-600 shadow-lg shadow-blue-500/10 scale-105' 
                          : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      <tab.icon size={16} />
                      <span className="hidden sm:inline">{tab.label}</span>
                      {activeTab === tab.id && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block" />

                <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm gap-1">
                  <button
                    onClick={() => setActiveTab('saida')}
                    className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                      activeTab === 'saida' 
                        ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-500/10 scale-105' 
                        : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50'
                    }`}
                  >
                    <ExternalLink size={16} />
                    <span className="hidden sm:inline">Saída</span>
                    {activeTab === 'saida' && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('recebimento')}
                    className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                      activeTab === 'recebimento' 
                        ? 'bg-white text-emerald-600 shadow-lg shadow-emerald-500/10 scale-105' 
                        : 'text-slate-500 hover:text-emerald-600 hover:bg-white/50'
                    }`}
                  >
                    <Package size={16} />
                    <span className="hidden sm:inline">Recebimento</span>
                    {activeTab === 'recebimento' && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"
                      />
                    )}
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar: Inputs & Config */}
          {activeTab !== 'saida' && activeTab !== 'recebimento' && (
            <aside className="lg:col-span-3 space-y-6 h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-thin sticky top-32 [scrollbar-gutter:stable]">
              
              {/* Global Config */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Settings2 size={16} /> Configurações
                </h2>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Modelo Material</label>
                  <div className="relative">
                    <input 
                      list="material-models"
                      name="materialBase" 
                      value={config.materialBase} 
                      onChange={handleConfigChange}
                      placeholder="Ex: Reposi, Imobil..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <datalist id="material-models">
                      {materialModels.map(model => (
                        <option key={model.id} value={model.id}>{model.label}</option>
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Requisitante</label>
                  <input 
                    type="text" 
                    name="requisitante" 
                    value={config.requisitante} 
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Lote Cópia</label>
                  <input 
                    type="number" 
                    name="loteTamanho" 
                    value={config.loteTamanho} 
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Centro</label>
                  <input 
                    type="text" 
                    name="centro" 
                    value={config.centro} 
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {activeTab === 'sc' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 pt-2 border-t border-slate-100"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase">GC</label>
                        <input type="text" name="gc" value={config.gc} onChange={handleConfigChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase">Cód. C</label>
                        <input type="text" name="codigoC" value={config.codigoC} onChange={handleConfigChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Data Remessa</label>
                      <input type="text" name="dtRemessa" value={config.dtRemessa} onChange={handleConfigChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.section>

            {/* Input Area */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Entrada de Dados</h2>
                <button 
                  onClick={() => setInputText('Solicitamos autorização para os seguintes orçamentos: local: ESTEIRA DA ESTANQUEIDADE Equipamento: ESTEIRA DA ESTANQUEIDADE itens: - VET S1000 PASSAGEM PLENA WCB 300 Valor: R$ 4.512,00 local: CARROSSEL P13 Equipamento: CARROSSEL P13 itens: - CORRENTE ASA RD 80/2 - EMENDA CL 80/2 Valor: R$ 2.105,00 local: LANÇA 4 Equipamento: LANÇA 4 itens: - RODA DENTADA ANSI D60B 23 DENTES - RODA DENTADA ANSI D60B12H 12 DENTES - EMENDA CL 60/2 - CORRENTE RD 60/2 Valor: R$ 2.207,00')}
                  className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-tight flex items-center gap-1"
                >
                  <Wand2 size={10} />
                  Carregar Exemplo
                </button>
              </div>
              
              <div className="relative group">
                <textarea 
                  className="w-full min-h-[160px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  placeholder="Cole a lista de materiais aqui (Texto ou Ctrl+V para Imagem)..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-400 bg-white/80 px-2 py-1 rounded border border-slate-100">
                  {inputText.length} caracteres
                </div>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-xl p-6 transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  multiple 
                  onChange={handleFileChange} 
                />
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                  <Upload size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700">Anexar Fotos ou PDF</p>
                  <p className="text-xs text-slate-400">Extração automática ou cole com Ctrl+V</p>
                </div>
              </div>

              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 group">
                        <div className="flex items-center gap-2 overflow-hidden">
                          {file.type.includes('pdf') ? <FileText size={14} className="text-red-500" /> : <ImageIcon size={14} className="text-blue-500" />}
                          <span className="text-xs font-medium truncate max-w-[140px]">{file.name}</span>
                        </div>
                        <button onClick={() => removeFile(idx)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={clearAll}
                  className="p-3 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition-all border border-slate-200"
                  title="Limpar tudo"
                >
                  <Trash2 size={20} />
                </button>
                <button 
                  onClick={() => processWithAI(0)}
                  disabled={isProcessing || (!inputText.trim() && files.length === 0)}
                  className={`flex-1 py-3 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                    isProcessing 
                      ? 'bg-blue-500 text-white animate-pulse shadow-blue-200' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                  } disabled:bg-slate-200 disabled:shadow-none`}
                >
                  {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
                  {isProcessing ? 'Analisando...' : 'Analisar Itens'}
                </button>
              </div>
            </motion.section>

            {/* Status Messages */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-700 text-sm relative group"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div className="flex-1 pr-6">
                    <p className="font-bold mb-1">Ops! Algo deu errado</p>
                    <p className="text-red-600/80 leading-relaxed">{error}</p>
                  </div>
                  <button 
                    onClick={() => setError(null)}
                    className="absolute top-3 right-3 p-1 hover:bg-red-100 rounded-lg transition-colors text-red-400 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              )}
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3 text-emerald-700 text-sm"
                >
                  <CheckCircle2 size={18} className="shrink-0" />
                  <p className="font-medium">{successMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Help Section */}
            <section className="bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-700 text-white space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Info size={14} /> Dicas de Uso
              </h3>
              <ul className="text-[11px] space-y-2 text-slate-300">
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>Modelo Material:</strong> Você pode digitar qualquer valor ou escolher da lista.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>SAP Grid-Lock:</strong> Use o botão "Copiar Lote" para colar no SAP sem erros de alinhamento.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>Imagens:</strong> Fotos de listas escritas à mão funcionam melhor se estiverem bem iluminadas.</span>
                </li>
              </ul>
            </section>

            {/* Smart Suggestions */}
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-2xl shadow-lg shadow-blue-200 text-white relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Sparkles size={100} />
              </div>
              
              <div className="relative space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <Lightbulb size={16} className="text-amber-300" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider">Sugestão Inteligente</h3>
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={suggestionIdx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs font-medium text-blue-50 leading-relaxed min-h-[48px]"
                    >
                      "{SMART_SUGGESTIONS[suggestionIdx]}"
                    </motion.p>
                  </AnimatePresence>
                  
                  <button 
                    onClick={() => setShowGuide(true)}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    Ver Tutorial Completo
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Recent History Section */}
            <AnimatePresence>
              {history.length > 0 && (
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <History size={14} /> Histórico Recente
                    </h3>
                    <button 
                      onClick={() => { setHistory([]); localStorage.removeItem('sap_assistant_history'); }}
                      className="text-[9px] font-bold text-slate-400 hover:text-red-500 uppercase transition-colors"
                    >
                      Limpar
                    </button>
                  </div>
                  <div className="space-y-2">
                    {history.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => {
                          setRawAiData(item.items);
                          setSuccessMsg('Histórico restaurado!');
                          setTimeout(() => setSuccessMsg(''), 3000);
                        }}
                        className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-bold text-slate-600">{item.date}</span>
                          <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            {item.count} Itens
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          {item.items[0]?.descricao || 'Sem descrição'}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
            </aside>
          )}

          {/* Main Content: Table/Email */}
          <main className={`${(activeTab === 'saida' || activeTab === 'recebimento') ? 'lg:col-span-12' : 'lg:col-span-9'} bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-160px)] sticky top-32`}>
            
            {/* Toolbar */}
            {activeTab !== 'saida' && activeTab !== 'recebimento' && (
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activeTab === 'email' ? 'bg-emerald-100 text-emerald-600' : 
                    activeTab === 'auth' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {activeTab === 'sc' && <ShoppingCart size={20} />}
                    {activeTab === 'os' && <Wrench size={20} />}
                    {activeTab === 'pc' && <FileSpreadsheet size={20} />}
                    {activeTab === 'auth' && <CheckCircle2 size={20} />}
                    {activeTab === 'email' && <Mail size={20} />}
                  </div>
                  <h2 className="font-bold text-slate-800">
                    {activeTab === 'sc' ? 'Solicitação de Compra' : activeTab === 'os' ? 'Ordem de Serviço' : activeTab === 'pc' ? 'Pedido de Compra' : activeTab === 'auth' ? 'Autorização de Orçamento' : 'E-mail de Cotação'}
                  </h2>
                  {tableData.length > 0 && (
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      {tableData.length} Itens
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {activeTab !== 'email' && (
                    <button 
                      onClick={() => setShowCopyConfig(!showCopyConfig)}
                      className={`p-2 rounded-lg border transition-all ${showCopyConfig ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                      title="Configurar Colunas"
                    >
                      <SlidersHorizontal size={20} />
                    </button>
                  )}
                
                {activeTab === 'email' ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const text = customEmailBody !== null ? customEmailBody : generatedEmailContent;
                        const plainText = text.replace(/\*\*/g, '');
                        const htmlText = text
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>');

                        try {
                          const blobPlain = new Blob([plainText], { type: 'text/plain' });
                          const blobHtml = new Blob([htmlText], { type: 'text/html' });
                          const data = [new ClipboardItem({
                            'text/plain': blobPlain,
                            'text/html': blobHtml
                          })];
                          navigator.clipboard.write(data).then(() => {
                            setSuccessMsg('E-mail copiado com formatação!');
                            setTimeout(() => setSuccessMsg(''), 4000);
                          });
                        } catch (err) {
                          // Fallback to plain text
                          navigator.clipboard.writeText(plainText).then(() => {
                            setSuccessMsg('E-mail copiado!');
                            setTimeout(() => setSuccessMsg(''), 4000);
                          });
                        }
                      }}
                      disabled={tableData.length === 0}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-emerald-100"
                    >
                      <ClipboardCopy size={18} /> Copiar
                    </button>
                    <button 
                      onClick={() => handleSendEmail('gmail')}
                      disabled={tableData.length === 0}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-100"
                    >
                      <Send size={18} /> Gmail
                    </button>
                    <button 
                      onClick={() => handleSendEmail('mailto')}
                      disabled={tableData.length === 0}
                      className="px-4 py-2 bg-slate-800 hover:bg-black disabled:bg-slate-200 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-slate-100"
                    >
                      <Mail size={18} /> Outros
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {copiedCount > 0 && (
                      <button 
                        onClick={() => setCopiedCount(0)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Reiniciar Cópia"
                      >
                        <RotateCcw size={20} />
                      </button>
                    )}
                    <button 
                      onClick={copyAllToClipboard}
                      disabled={tableData.length === 0}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl flex items-center gap-2 transition-all border border-slate-200"
                      title="Copiar todas as linhas de uma vez"
                    >
                      <ClipboardCopy size={18} />
                      Tudo
                    </button>
                    <button 
                      onClick={copyBatchToClipboard}
                      disabled={!hasMoreToCopy || tableData.length === 0}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-black disabled:bg-emerald-600 text-white text-sm font-bold rounded-xl flex items-center gap-3 transition-all shadow-lg"
                    >
                      {hasMoreToCopy ? (
                        <>
                          <ClipboardCopy size={18} />
                          Copiar Lote ({copiedCount + 1} - {nextBatchEnd})
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          Concluído
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Column Config Panel */}
            <AnimatePresence>
              {showCopyConfig && activeTab !== 'email' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-blue-50/50 border-b border-blue-100 overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Info size={14} />
                      <p className="text-[11px] font-bold uppercase tracking-wider">Seletor de Colunas para Cópia (SAP Grid-Lock)</p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {currentColsDef.map(col => (
                        <label key={col.id} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={currentCopyColumns[col.id]}
                            onChange={() => toggleCopyColumn(col.id)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`text-xs font-medium transition-colors ${currentCopyColumns[col.id] ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                            {col.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content Area */}
            <div className="flex-1 overflow-auto [scrollbar-gutter:stable]">
              {tableData.length === 0 && activeTab !== 'email' && activeTab !== 'saida' && activeTab !== 'auth' && activeTab !== 'recebimento' ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 p-12 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <FileSpreadsheet size={40} className="opacity-20" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-400">Nenhum dado processado</h3>
                  <p className="text-sm max-w-xs mt-2">Utilize o painel lateral para inserir texto ou imagens e gerar a tabela automatizada.</p>
                </div>
              ) : activeTab === 'auth' ? (
                <div className="p-6 space-y-6 max-w-4xl mx-auto">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <span className="text-xs font-bold text-slate-400 uppercase text-right">Destinatário</span>
                      <input 
                        type="text" 
                        placeholder="Ex: Sr. João"
                        value={authRecipient} 
                        onChange={(e) => setAuthRecipient(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <span className="text-xs font-bold text-slate-400 uppercase text-right">Remetente</span>
                      <input 
                        type="text" 
                        placeholder="Ex: Alex Rodrigues"
                        value={authSender} 
                        onChange={(e) => setAuthSender(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle2 className="text-blue-500" size={20} />
                        Solicitação de Autorização
                      </h3>
                      <button 
                        onClick={() => {
                          const text = generateAuthText();
                          navigator.clipboard.writeText(text);
                          setSuccessMsg('Texto copiado!');
                          setTimeout(() => setSuccessMsg(''), 3000);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                      >
                        <Copy size={14} />
                        Copiar Texto
                      </button>
                    </div>

                    <div className="text-slate-700 font-mono text-sm leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                      {generateAuthText()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(groupItemsBySector()).map(([sector, items]) => (
                      <div key={sector} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="text-xs font-black text-blue-600 uppercase tracking-wider mb-3 border-b border-slate-50 pb-2">
                          {sector}
                        </h4>
                        <ul className="space-y-2">
                          {items.map((item, idx) => (
                            <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1 flex-shrink-0" />
                              <span>
                                <strong className="text-slate-800">{item.textoBreve || item.denominacao || item.componente || 'Item'}</strong>
                                {(item.preco || item.precoLiq) && (item.preco !== '0,00' && item.preco !== '1,00' && item.precoLiq !== '0,00' && item.precoLiq !== '1,00') && (
                                  <span className="text-emerald-600 font-bold ml-2">R$ {item.preco || item.precoLiq}</span>
                                )}
                                {item.local && <span className="text-slate-400 ml-1 block mt-0.5">↳ Local: {item.local}</span>}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeTab === 'email' ? (
                <div className="p-6 space-y-6 max-w-4xl mx-auto">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                      <span className="text-xs font-bold text-slate-400 uppercase text-right">Para</span>
                      <input 
                        type="text" 
                        value={emailConfig.to} 
                        onChange={(e) => setEmailConfig(prev => ({ ...prev, to: e.target.value }))}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                      <span className="text-xs font-bold text-slate-400 uppercase text-right">Cc</span>
                      <input 
                        type="text" 
                        value={emailConfig.cc} 
                        onChange={(e) => setEmailConfig(prev => ({ ...prev, cc: e.target.value }))}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                      <span className="text-xs font-bold text-slate-400 uppercase text-right">Assunto</span>
                      <input 
                        type="text" 
                        value={emailConfig.subject} 
                        onChange={(e) => setEmailConfig(prev => ({ ...prev, subject: e.target.value }))}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    {isEditingEmail ? (
                      <textarea 
                        value={customEmailBody !== null ? customEmailBody : generatedEmailContent}
                        onChange={(e) => setCustomEmailBody(e.target.value)}
                        className="w-full min-h-[400px] p-8 bg-white border border-slate-200 rounded-2xl text-slate-700 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
                      />
                    ) : (
                      <div 
                        className="w-full min-h-[400px] p-8 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm leading-relaxed shadow-sm overflow-y-auto"
                        dangerouslySetInnerHTML={{ 
                          __html: (customEmailBody !== null ? customEmailBody : generatedEmailContent)
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br/>')
                        }}
                      />
                    )}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <button 
                        onClick={() => setIsEditingEmail(!isEditingEmail)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-white text-slate-500 rounded-full text-[10px] font-bold hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
                      >
                        {isEditingEmail ? <Eye size={12} /> : <Edit3 size={12} />}
                        {isEditingEmail ? 'Visualizar' : 'Editar'}
                      </button>
                      {customEmailBody !== null && (
                        <button 
                          onClick={() => setCustomEmailBody(null)}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold hover:bg-slate-200 transition-colors"
                        >
                          <RotateCcw size={10} /> Resetar
                        </button>
                      )}
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase border border-emerald-100">
                        <Copy size={10} /> Editável
                      </div>
                    </div>
                  </div>

                  {files.some(f => f.type.startsWith('image/')) && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <ImageIcon size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Imagens Anexadas para Referência</h3>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {files.filter(f => f.type.startsWith('image/')).map((file, idx) => (
                          <div key={idx} className="aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm group relative">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt="Preview" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[8px] text-white font-bold uppercase tracking-tighter text-center px-1">{file.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 italic">* Lembre-se de anexar manualmente estes arquivos ao seu Gmail após clicar no botão de envio.</p>
                    </div>
                  )}
                </div>
              ) : activeTab === 'saida' ? (
                <div className="p-6 space-y-6 max-w-4xl mx-auto">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-4">
                      <ExternalLink className="text-blue-600" size={24} />
                      <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                        E-mail de Saída de Materiais
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <span className="text-xs font-bold text-slate-400 uppercase text-right">Tipo de Saída</span>
                      <input 
                        type="text" 
                        placeholder="Ex: PEÇAS, EQUIPAMENTO, MATERIAL"
                        value={saidaType} 
                        onChange={(e) => setSaidaType(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                      />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <span className="text-xs font-bold text-slate-400 uppercase text-right">Fornecedor/Destino</span>
                      <input 
                        type="text" 
                        placeholder="Ex: Tornearia Oliveira"
                        value={saidaFornecedor} 
                        onChange={(e) => setSaidaFornecedor(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                      <span className="text-xs font-bold text-slate-400 uppercase text-right mt-3">Itens</span>
                      <textarea 
                        placeholder="Ex: Suporte de parafusadeira - 1 PC"
                        value={saidaItems} 
                        onChange={(e) => setSaidaItems(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] resize-y"
                      />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <span className="text-xs font-bold text-slate-400 uppercase text-right">Remetente</span>
                      <input 
                        type="text" 
                        placeholder="Ex: Alex Rodrigues"
                        value={authSender} 
                        onChange={(e) => setAuthSender(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="text-blue-500" size={18} />
                        Visualização do E-mail
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const text = generateSaidaText();
                            navigator.clipboard.writeText(text);
                            setSuccessMsg('Texto copiado!');
                            setTimeout(() => setSuccessMsg(''), 3000);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all shadow-sm"
                        >
                          <Copy size={14} />
                          Copiar Texto
                        </button>
                        <button 
                          onClick={() => {
                            const subject = encodeURIComponent(`SAÍDA DE ${saidaType.toUpperCase()}`);
                            const body = encodeURIComponent(generateSaidaText());
                            const to = encodeURIComponent('portaria.manaus@fogas.com.br');
                            const cc = encodeURIComponent('bruno.lamas@fogas.com.br,manutencao@fogas.com.br');
                            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${to}&cc=${cc}&su=${subject}&body=${body}`, '_blank');
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                        >
                          <Mail size={14} />
                          Abrir no Gmail
                        </button>
                      </div>
                    </div>

                    <div className="text-slate-700 font-mono text-sm leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                      {generateSaidaText()}
                    </div>
                  </div>
                </div>
              ) : activeTab === 'recebimento' ? (
                <div className="p-6 space-y-6 max-w-4xl mx-auto">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-4">
                      <Package className="text-emerald-600" size={24} />
                      <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                        Formatação de Recebimento
                      </h3>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-400 uppercase">Cole o texto do chat aqui</label>
                        <div className="relative">
                          <button 
                            onClick={() => setShowRecebimentoUpload(!showRecebimentoUpload)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Opções adicionais"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                      <textarea 
                        placeholder="Ex: 
Chegou material para o Anderson
1 teclado
1 mouse
Para o João:
2 monitores"
                        value={rawRecebimentoText} 
                        onChange={(e) => setRawRecebimentoText(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none min-h-[150px] resize-y"
                      />
                    </div>

                    <AnimatePresence>
                      {showRecebimentoUpload && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden space-y-2"
                        >
                          <label className="text-xs font-bold text-slate-400 uppercase">Ou anexe fotos/prints</label>
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 rounded-xl p-6 transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center mt-2"
                          >
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              className="hidden" 
                              multiple 
                              onChange={handleFileChange} 
                            />
                            <div className="w-10 h-10 bg-slate-100 group-hover:bg-emerald-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                              <Upload size={20} />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-slate-700">Anexar Fotos ou PDF</p>
                              <p className="text-xs text-slate-400">Arraste arquivos ou cole com Ctrl+V</p>
                            </div>
                          </div>

                          {files.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-2 mt-4"
                            >
                              {files.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 group">
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    {file.type.includes('pdf') ? <FileText size={14} className="text-red-500" /> : <ImageIcon size={14} className="text-emerald-500" />}
                                    <span className="text-xs font-medium truncate max-w-[200px]">{file.name}</span>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="flex justify-end gap-2">
                      {files.length > 0 && (
                        <button 
                          onClick={clearAll}
                          className="px-4 py-3 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition-all border border-slate-200 text-sm font-bold"
                        >
                          Limpar
                        </button>
                      )}
                      <button
                        onClick={processRecebimento}
                        disabled={isProcessingRecebimento || (!rawRecebimentoText.trim() && files.length === 0)}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessingRecebimento ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Wand2 size={18} />
                        )}
                        Formatar Texto
                      </button>
                    </div>
                  </div>
                  
                  {formattedRecebimentoText && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                          <FileText className="text-emerald-500" size={18} />
                          Texto Formatado
                        </h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(formattedRecebimentoText);
                              setSuccessMsg('Texto copiado!');
                              setTimeout(() => setSuccessMsg(''), 3000);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all shadow-sm"
                          >
                            <Copy size={14} />
                            Copiar Texto
                          </button>
                          <button 
                            onClick={() => {
                              const text = encodeURIComponent(formattedRecebimentoText);
                              window.open(`https://wa.me/?text=${text}`, '_blank');
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                          >
                            <MessageCircle size={14} />
                            WhatsApp
                          </button>
                        </div>
                      </div>

                      <textarea 
                        value={formattedRecebimentoText}
                        onChange={(e) => setFormattedRecebimentoText(e.target.value)}
                        className="w-full text-slate-700 font-mono text-sm leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-6 rounded-xl border border-slate-100 min-h-[200px] resize-y outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  {/* Smart Inspector Bar (Sticky) */}
                  <AnimatePresence>
                    {selectedRowIndex !== null && tableData[selectedRowIndex] && activeTab !== 'os' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-blue-600 text-white overflow-hidden shadow-lg sticky top-0 z-40"
                      >
                        <div className="px-6 py-4 flex items-center justify-between gap-6">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                              <Calculator size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-0.5">Assistente Contábil • Item #{selectedRowIndex + 1}</p>
                              <p className="text-sm font-bold truncate opacity-90">
                                {tableData[selectedRowIndex].textoBreve || tableData[selectedRowIndex].denominacao || 'Item Selecionado'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 flex flex-col items-end">
                              <p className="text-[9px] font-bold uppercase tracking-widest text-blue-200">Conta Sugerida</p>
                              <p className="text-lg font-black leading-none mt-1">{tableData[selectedRowIndex].contaRazao || '---'}</p>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 flex flex-col items-end">
                              <p className="text-[9px] font-bold uppercase tracking-widest text-blue-200">Confiança IA</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-12 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-400 w-[98%]" />
                                </div>
                                <p className="text-xs font-black leading-none">98%</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setSelectedRowIndex(null)}
                              className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* SAP Paste Instructions Banner */}
                  <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white/20 rounded-lg">
                        <MousePointer2 size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Instrução de Colagem SAP</p>
                        <p className="text-sm font-bold">
                          {activeTab === 'sc' && "No SAP, clique na primeira célula da coluna 'C' e pressione Ctrl+V."}
                          {activeTab === 'os' && "No SAP, clique na primeira célula da coluna 'Componente' e pressione Ctrl+V."}
                          {activeTab === 'pc' && "No SAP, clique na primeira célula da coluna 'C' e pressione Ctrl+V."}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                      <Zap size={12} className="text-amber-300" />
                      <span className="text-[9px] font-black uppercase tracking-tighter">Dica: Use o botão 'Copiar Lote' para evitar erros de alinhamento</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto [transform:rotateX(180deg)]">
                    <table className="w-full text-left border-collapse [transform:rotateX(180deg)]">
                      <thead className="sticky top-0 bg-slate-50 z-20 shadow-sm">
                      <tr>
                        {currentColsDef.map((col) => (
                          <th 
                            key={col.id} 
                            className={`px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 whitespace-nowrap ${!currentCopyColumns[col.id] ? 'bg-slate-100/50 opacity-40' : ''}`}
                          >
                            {col.label}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 text-center">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tableData.map((row, idx) => {
                        const isCopied = idx < copiedCount;
                        const itemName = row.textoBreve || row.denominacao || row.componente || '';
                        const isMissingData = !itemName || !row.quantidade || row.preco === '0,00' || row.preco === '1,00' || row.precoLiq === '0,00';
                        
                        return (
                          <motion.tr 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                            onClick={() => setSelectedRowIndex(idx)}
                            className={`group cursor-pointer transition-colors ${isCopied ? 'bg-emerald-50/40' : (selectedRowIndex === idx ? 'bg-blue-50 ring-1 ring-inset ring-blue-200' : 'hover:bg-blue-50/30')} ${isMissingData ? 'bg-amber-50/20' : ''}`}
                          >
                            {currentColsDef.map((col) => (
                              <td 
                                key={col.id} 
                                className={`px-4 py-2 border-r border-slate-50 last:border-0 ${!currentCopyColumns[col.id] ? 'opacity-30' : ''}`}
                              >
                                <div className="relative flex items-center group/cell">
                                  <input 
                                    type="text"
                                    value={row[col.id] || ''}
                                    onChange={(e) => handleCellChange(idx, col.id, e.target.value)}
                                    onBlur={(e) => {
                                      if (col.id === 'preco' || col.id === 'precoLiq') {
                                        handleCellChange(idx, col.id, formatSAPPrice(e.target.value));
                                      }
                                    }}
                                    className={`w-full bg-transparent border-none focus:ring-0 p-0 text-xs font-medium transition-all ${
                                      isCopied ? 'text-emerald-700' : (isMissingData && (col.id === 'textoBreve' || col.id === 'denominacao' || col.id === 'preco' || col.id === 'precoLiq') ? 'text-amber-600' : 'text-slate-700')
                                    } ${col.id === 'textoBreve' || col.id === 'denominacao' ? 'min-w-[240px]' : 'min-w-[40px]'}`}
                                  />
                                  {(col.id === 'textoBreve' || col.id === 'denominacao') && row.contaRazao && activeTab !== 'os' && (
                                    <div className="mt-0.5 flex items-center gap-1 text-[9px] font-bold text-blue-500/60 italic">
                                      <Calculator size={10} />
                                      Sugestão: {row.contaRazao}
                                    </div>
                                  )}
                                  <div className="absolute right-0 opacity-0 group-hover/cell:opacity-100 transition-opacity pointer-events-none">
                                    <Copy size={10} className="text-slate-300" />
                                  </div>
                                </div>
                              </td>
                            ))}
                            <td className="px-4 py-2 text-center">
                              <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/search?q=${encodeURIComponent(itemName)}`, '_blank'); }}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Pesquisar no Google"
                                >
                                  <Search size={14} />
                                </button>
                                {row.contaRazao && activeTab !== 'os' && (
                                  <div className="p-1.5 text-blue-500" title={`Sugestão Contábil: ${row.contaRazao}`}>
                                    <Calculator size={14} />
                                  </div>
                                )}
                                {isMissingData && (
                                  <div className="p-1.5 text-amber-500" title="Atenção: Dados incompletos ou padrão">
                                    <AlertCircle size={14} />
                                  </div>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                  
                  {/* Footer Stats */}
                  <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-3 flex items-center justify-between z-30">
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Total: {tableData.length}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        Copiados: {copiedCount}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        Restantes: {tableData.length - copiedCount}
                      </div>
                    </div>
                    
                    {copiedCount > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(copiedCount / tableData.length) * 100}%` }}
                            className="h-full bg-emerald-500"
                          />
                        </div>
                        <span className="text-[10px] font-black text-emerald-600">{Math.round((copiedCount / tableData.length) * 100)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </motion.div>

      <AnimatePresence>
        {processingStats && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50, x: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, x: 50 }}
            className="fixed bottom-6 right-6 z-[100] bg-blue-600 text-white p-4 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl flex items-center gap-4 overflow-hidden"
          >
            {/* Progress Bar Countdown */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-white/30"
            />

            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain size={20} />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Ganho</p>
                <p className="text-sm font-black">+{processingStats.efficiency}%</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-60">IA</p>
                <div className="flex items-baseline gap-0.5">
                  <p className="text-sm font-black">{processingStats.aiTime}</p>
                  <span className="text-[10px] font-bold opacity-60">s</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setProcessingStats(null)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              title="Fechar Relatório"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}