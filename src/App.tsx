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
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants & Types ---

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
  { id: 'requisitante', label: 'Requisitante' }
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
  { id: 'ptoDescarga', label: 'Pto.descarga' }
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
  { id: 't', label: 'T' },
  { id: 'dtRemessa', label: 'Dt.remessa' },
  { id: 'precoLiq', label: 'Preço líq.' },
  { id: 'moeda', label: 'Moeda' },
  { id: 'por', label: 'por' },
  { id: 'unidade', label: 'U..' },
  { id: 'grpMercads', label: 'GrpMercads.' },
  { id: 'centro', label: 'Cen.' }
];

type TabType = 'sc' | 'os' | 'pc' | 'email';

// --- Components ---

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('sc');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [rawAiData, setRawAiData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showCopyConfig, setShowCopyConfig] = useState(false);
  const [copiedCount, setCopiedCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState({
    centro: '0100',
    gc: '107',
    requisitante: 'Thiago Lima',
    dtRemessa: '',
    codigoC: 'K',
    materialBase: 'Reposi', 
    preco: '1,00',
    loteTamanho: 10
  });

  const materialModels = [
    { id: 'Reposi', label: 'REPOSI (Reposição)' },
    { id: 'Imobil', label: 'IMOBIL (Imobilizado)' },
    { id: 'Consum', label: 'CONSUM (Consumo)' },
    { id: 'Servic', label: 'SERVIC (Serviço)' },
  ];

  const [emailConfig, setEmailConfig] = useState({
    to: 'laura@fogas.com.br, compras@fogas.com.br',
    cc: 'bruno.lamas@fogas.com.br, manutencao@fogas.com.br',
    subject: 'REQUISIÇÃO DE COMPRA , (                   )'
  });

  const [copyColumnsSC, setCopyColumnsSC] = useState(
    COLUMNS_SC.reduce((acc, col) => ({ ...acc, [col.id]: col.id !== 'sta' && col.id !== 'itemNum' }), {} as Record<string, boolean>)
  );
  const [copyColumnsOS, setCopyColumnsOS] = useState(
    COLUMNS_OS.reduce((acc, col) => ({ ...acc, [col.id]: col.id !== 'itemNum' && col.id !== 'tItem' }), {} as Record<string, boolean>)
  );
  const [copyColumnsPC, setCopyColumnsPC] = useState(
    COLUMNS_PC.reduce((acc, col) => ({ ...acc, [col.id]: col.id !== 'sta' && col.id !== 'itemNum' }), {} as Record<string, boolean>)
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
          const isPar = String(value).toUpperCase() === 'PAR';
          updatedRow.material = isPar ? `${config.materialBase}(PAR)` : `${config.materialBase}(UN)`;
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
        const qty = item.quantidade && item.quantidade > 0 ? item.quantidade.toString() : '1';
        const price = (item.preco && item.preco !== '0,00') ? item.preco : (config.preco || '1,00');
        
        return {
          sta: '🔴',
          itemNum: ((idx + 1) * 10).toString(),
          c: config.codigoC || '',
          i: '',
          material: config.materialBase || '',
          textoBreve: item.descricao || '',
          quantidade: qty,
          um: unit,
          preco: price,
          t: 'D',
          dtRemessa: config.dtRemessa || '',
          grpMercads: '',
          centro: config.centro || '',
          deposito: '',
          gc: config.gc || '',
          requisitante: config.requisitante || '',
        };
      });
      setTableData(generatedTable);
    } else if (tab === 'os') {
      const generatedTable = items.map((item, idx) => {
        return {
          itemNum: String((idx + 1) * 10).padStart(4, '0'),
          componente: '',
          denominacao: item.descricao || '',
          tItem: '',
          qtdNecess: item.quantidade !== undefined ? item.quantidade.toString() : '',
          um: (item.unidade || '').toUpperCase(),
          ti: '',
          e: '',
          dep: '',
          cen: '',
          oper: '',
          lote: '',
          ctgSuprimento: '',
          recebedor: config.requisitante || '',
          ptoDescarga: ''
        };
      });
      setTableData(generatedTable);
    } else if (tab === 'pc') {
      const generatedTable = items.map((item, idx) => {
        const unit = (item.unidade || 'UN').toUpperCase();
        const qty = item.quantidade && item.quantidade > 0 ? item.quantidade.toString() : '1';
        const price = (item.preco && item.preco !== '0,00') ? item.preco : (config.preco || '1,00');

        return {
          sta: '',
          itemNum: ((idx + 1) * 10).toString(),
          c: config.codigoC || '',
          i: '',
          material: config.materialBase || '',
          textoBreve: `Sv. ${item.descricao || ''}`,
          qtdPedido: qty,
          um: unit,
          t: 'D',
          dtRemessa: config.dtRemessa || '',
          precoLiq: price,
          moeda: 'BRL',
          por: '1',
          unidade: unit,
          grpMercads: '',
          centro: config.centro || '',
        };
      });
      setTableData(generatedTable);
    }
  };

  const processWithAI = async (retryCount = 0) => {
    if (!inputText.trim() && files.length === 0) {
      setError('Por favor, cole algum texto ou anexe um ficheiro/foto com a lista de materiais.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccessMsg('');

    try {
      const filePayloads: Array<{ data: string; mimeType: string }> = [];

      for (const file of files) {
        const base64Data = await fileToBase64(file);
        filePayloads.push({
          data: base64Data,
          mimeType: file.type,
        });
      }

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim() || undefined,
          files: filePayloads.length > 0 ? filePayloads : undefined,
        }),
      });

      const jsonResult = await response.json();

      if (!response.ok) {
        // Auto-retry on rate limit (429) up to 2 times with increasing delay
        if (response.status === 429 && retryCount < 2) {
          const waitSec = (retryCount + 1) * 5;
          setError(`Serviço de IA sobrecarregado. Tentando novamente em ${waitSec}s...`);
          await new Promise(resolve => setTimeout(resolve, waitSec * 1000));
          setError(null);
          return processWithAI(retryCount + 1);
        }
        throw new Error(jsonResult.error || `Erro do servidor (${response.status})`);
      }

      if (jsonResult.materiais && Array.isArray(jsonResult.materiais) && jsonResult.materiais.length > 0) {
        setRawAiData(jsonResult.materiais);
        setSuccessMsg(`Sucesso! ${jsonResult.materiais.length} itens processados.`);
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        throw new Error('A IA não conseguiu identificar materiais na sua entrada. Verifique se o texto ou imagem estão legíveis.');
      }
    } catch (err: any) {
      console.error('Erro no processamento IA:', err);
      let msg = 'Erro ao processar com IA';
      if (err.message) msg += ': ' + err.message;
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
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
        rowData.push(copyColumnsPC.t ? String(row.t || '').trim() : '');
        rowData.push(copyColumnsPC.dtRemessa ? String(row.dtRemessa || '').trim() : '');
        rowData.push(copyColumnsPC.precoLiq ? String(row.precoLiq || '').trim() : '');
        rowData.push(copyColumnsPC.moeda ? String(row.moeda || '').trim() : '');
        rowData.push(copyColumnsPC.por ? String(row.por || '').trim() : '');
        rowData.push(copyColumnsPC.unidade ? String(row.unidade || '').trim() : '');
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
    }).catch(() => {
      setError('Falha ao copiar para o clipboard.');
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
        rowData.push(copyColumnsPC.t ? String(row.t || '').trim() : '');
        rowData.push(copyColumnsPC.dtRemessa ? String(row.dtRemessa || '').trim() : '');
        rowData.push(copyColumnsPC.precoLiq ? String(row.precoLiq || '').trim() : '');
        rowData.push(copyColumnsPC.moeda ? String(row.moeda || '').trim() : '');
        rowData.push(copyColumnsPC.por ? String(row.por || '').trim() : '');
        rowData.push(copyColumnsPC.unidade ? String(row.unidade || '').trim() : '');
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
    }).catch(() => {
      setError('Falha ao copiar para o clipboard.');
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
      const rawDetalhe = rawAiData[idx]?.detalhes?.trim() || '';
      const hasRealDetail = rawDetalhe && !['nenhum', 'n/a', ''].includes(rawDetalhe.toLowerCase());
      const detalhes = hasRealDetail ? `\n   ↳ Especificações: ${rawDetalhe}` : '';
      return `• ${itemQtd} ${itemUm} - ${itemName}${detalhes}`;
    }).join('\n') +
    `\n\nAtenciosamente,`
  ) : '';

  const handleSendEmail = (method: 'mailto' | 'gmail' = 'mailto') => {
    if (!generatedEmailContent) return;
    
    if (method === 'gmail') {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailConfig.to)}&cc=${encodeURIComponent(emailConfig.cc)}&su=${encodeURIComponent(emailConfig.subject)}&body=${encodeURIComponent(generatedEmailContent)}`;
      window.open(gmailUrl, '_blank');
      setSuccessMsg('Abrindo Gmail...');
      setTimeout(() => setSuccessMsg(''), 4000);
      return;
    }

    // mailto has a limit of ~2000 characters in many browsers/clients
    if (generatedEmailContent.length > 1800) {
      setError('O conteúdo é muito longo para abrir automaticamente no e-mail. Por favor, use o botão "Copiar Texto" e cole manualmente no seu e-mail.');
      setTimeout(() => setError(null), 6000);
      return;
    }
    
    const mailtoLink = `mailto:${emailConfig.to}?cc=${emailConfig.cc}&subject=${encodeURIComponent(emailConfig.subject)}&body=${encodeURIComponent(generatedEmailContent)}`;
    
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
      window.location.href = mailtoLink;
    }
  };

  const currentColsDef = activeTab === 'sc' ? COLUMNS_SC : (activeTab === 'os' ? COLUMNS_OS : (activeTab === 'pc' ? COLUMNS_PC : []));
  const currentCopyColumns = activeTab === 'sc' ? copyColumnsSC : (activeTab === 'os' ? copyColumnsOS : (activeTab === 'pc' ? copyColumnsPC : {}));
  const hasMoreToCopy = tableData.length > 0 && copiedCount < tableData.length;
  const nextBatchEnd = Math.min(copiedCount + (Number(config.loteTamanho) || 10), tableData.length);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 relative">
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

      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <FileSpreadsheet size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">SAP Smart Assistant</h1>
              <p className="text-slate-500 text-sm font-medium">Automação Inteligente para MM & PM</p>
            </div>
          </div>

          <nav className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[
              { id: 'sc', label: 'Solicitação Compra', icon: ShoppingCart },
              { id: 'os', label: 'Ordem Serviço', icon: Wrench },
              { id: 'pc', label: 'Pedido Compra', icon: FileSpreadsheet },
              { id: 'email', label: 'Formato E-mail', icon: Mail }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <tab.icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar: Inputs & Config */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Global Config */}
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
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
            </section>

            {/* Input Area */}
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Entrada de Dados</h2>
              
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
                  onClick={processWithAI}
                  disabled={isProcessing || (!inputText && files.length === 0)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                >
                  {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
                  {isProcessing ? 'Processando...' : 'Analisar Itens'}
                </button>
              </div>
            </section>

            {/* Status Messages */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-700 text-sm"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="font-medium">{error}</p>
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
          </aside>

          {/* Main Content: Table/Email */}
          <main className="lg:col-span-9 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[700px]">
            
            {/* Toolbar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeTab === 'email' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                  {activeTab === 'sc' && <ShoppingCart size={20} />}
                  {activeTab === 'os' && <Wrench size={20} />}
                  {activeTab === 'email' && <Mail size={20} />}
                </div>
                <h2 className="font-bold text-slate-800">
                  {activeTab === 'sc' ? 'Solicitação de Compra' : activeTab === 'os' ? 'Ordem de Serviço' : activeTab === 'pc' ? 'Pedido de Compra' : 'E-mail de Cotação'}
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
                      onClick={() => navigator.clipboard.writeText(generatedEmailContent).then(() => setSuccessMsg('E-mail copiado!'))}
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
            <div className="flex-1 overflow-auto">
              {tableData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 p-12 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <FileSpreadsheet size={40} className="opacity-20" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-400">Nenhum dado processado</h3>
                  <p className="text-sm max-w-xs mt-2">Utilize o painel lateral para inserir texto ou imagens e gerar a tabela automatizada.</p>
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
                    <textarea 
                      readOnly
                      value={generatedEmailContent}
                      className="w-full min-h-[400px] p-8 bg-white border border-slate-200 rounded-2xl text-slate-700 font-mono text-sm leading-relaxed focus:outline-none shadow-sm"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase border border-emerald-100">
                        Visualização de E-mail
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <table className="w-full text-left border-collapse">
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tableData.map((row, idx) => {
                        const isCopied = idx < copiedCount;
                        return (
                          <motion.tr 
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`group transition-colors ${isCopied ? 'bg-emerald-50/40' : 'hover:bg-blue-50/30'}`}
                          >
                            {currentColsDef.map((col) => (
                              <td 
                                key={col.id} 
                                className={`px-4 py-2 border-r border-slate-50 last:border-0 ${!currentCopyColumns[col.id] ? 'opacity-30' : ''}`}
                              >
                                <input 
                                  type="text"
                                  value={row[col.id] || ''}
                                  onChange={(e) => handleCellChange(idx, col.id, e.target.value)}
                                  className={`w-full bg-transparent border-none focus:ring-0 p-0 text-xs font-medium transition-all ${
                                    isCopied ? 'text-emerald-700' : 'text-slate-700'
                                  } ${col.id === 'textoBreve' || col.id === 'denominacao' ? 'min-w-[240px]' : 'min-w-[40px]'}`}
                                />
                              </td>
                            ))}
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                  
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
      </div>
    </div>
  );
}