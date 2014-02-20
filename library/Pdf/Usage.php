<?php

class Pdf_Usage extends Pdf_FpdfTable {

    /**
     * Constante par aconversão de cm para pt
     * 
     * @var float
     */
    var $cm = 10.4;
    var $pixel = 0.2;
    /**
     * Arquivos temporários
     * 
     * @var array
     */
    var $tmpFiles = array();
    /**
     * Dados para o cabeçalho e rodapé
     * 
     * @var array
     */
    protected $_footerData = array();
    /**
     * O número de pontos verticias do relatório
     * Na pratica aumentando aqui, reduz a margem direita
     * 
     * @var integer
     */
    public $maxColunas = 195;
    /**
     * Armazena "Table of contents"
     * 
     * @var array
     */
    protected $_toc = array();
    
    /**
     * Armazena variaveis e seus ids, 
     * 
     * @var array
     */
    protected $_vars = array();
    /**
     * Determina se uma pagina será ou não numerada
     * 
     * @var boolean
     */
    protected $_numbering = false;
    /**
     * Determina se a paginação será exibida
     * 
     * @var boolean
     */
    protected $_footer = array();
    /**
     * Pagina atual
     * 
     * @var array
     */
    protected $_numPageNum = 0;
    
    
    /**
     * Posição atual da marca de contagem
     * 
     * @var int
     */
    protected $_marcaContagemX = 12;
    
    protected $strikeout = false;
    
     /**
     * HTMLs
     * 
     * 
     */   
    protected $htmlAlign = 'Left';
    protected $htmlIdentacao =0;
    protected $htmlFontSize ='12';
    protected $htmlLastTag ='';
    protected $htmlTagsPermitidas = "<p><br><div><tr><h1><h2><h3><h4><li><hr><b><i><u><strong><em>";
    protected $htmlTagsEstilosEspeciais = array('b','i','u','em');
    protected $htmlTagsParagrafos =array('P','H1','H2','H3','H4','TR','LI','HR','DIV');
    
    


    function _htmlTxtEntities($html){
        $trans = get_html_translation_table(HTML_ENTITIES);
        $trans = array_flip($trans);
        return strtr($html, $trans);
    }

    
    

   private function _htmlClean($html){
        $html=strip_tags($html,$this->htmlTagsPermitidas); 
        
        $html=str_replace("\n",' ',$html); //replace carriage returns by spaces
        $html=str_replace(array('<br />','<hr />','&#8220;','&#8221;','&#8222;','&#8230;','&#8217;','&ldquo;','&rdquo;'),array('<br>','<hr>','"','"','"','...','\'','"','"'),$html);
        $html = str_replace(array('style="text-align: center;"','style="text-align: right;"','style="text-align: left;"'),array('align="center"','align="right"','align="left"'), $html);
        $html = str_replace(array('<strong>','</strong>'),array('<b>','</b>'), $html);
        $html = str_replace('&trade;','?',$html);
        $html = str_replace('&copy;','©',$html);
        $html = str_replace('&euro;','?',$html);
        $html = preg_replace('/\s{2,}/', ' ',$html); //retira espaços duplicados
        $html = html_entity_decode($html);
        
        return $html;
   } 
    
   public function _alturaFonte(){
        return $this->FontSizePt/2.5;
   } 
   
    
    function WriteHTML($html, $margemEsquerda=10)
    {

        $this->htmlAlign='';
        $this->htmlLastTag='';
        $this->htmlFontSize = $this->FontSizePt;
        
        //estilos
        $this->setStyle("b", $this->FontFamily, "B", $this->FontSizePt, "0,0,0");
        $this->setStyle("em", $this->FontFamily, "I", $this->FontSizePt, "0,0,0");
        $this->setStyle("i", $this->FontFamily, "I", $this->FontSizePt, "0,0,0");        
        $this->setStyle("u", $this->FontFamily, "U", $this->FontSizePt, "0,0,0");     
        
        // h1
        $this->setStyle("h1b", $this->FontFamily, "B", 22, "0,0,0");
        $this->setStyle("h1em", $this->FontFamily, "I", 22, "0,0,0");
        $this->setStyle("h1i", $this->FontFamily, "I", 22, "0,0,0");        
        $this->setStyle("h1u", $this->FontFamily, "U", 22, "0,0,0");  
        
        // h2
        $this->setStyle("h2b", $this->FontFamily, "B", 18, "0,0,0");
        $this->setStyle("h2em", $this->FontFamily, "I", 18, "0,0,0");
        $this->setStyle("h2i", $this->FontFamily, "I", 18, "0,0,0");        
        $this->setStyle("h2u", $this->FontFamily, "U", 18, "0,0,0");    
        
        // h3
        $this->setStyle("h3b", $this->FontFamily, "B", 16, "0,0,0");
        $this->setStyle("h3em", $this->FontFamily, "I", 16, "0,0,0");
        $this->setStyle("h3i", $this->FontFamily, "I", 16, "0,0,0");        
        $this->setStyle("h3u", $this->FontFamily, "U", 16, "0,0,0");  
        
        // h4
        $this->setStyle("h4b", $this->FontFamily, "B", 14, "0,0,0");
        $this->setStyle("h4em", $this->FontFamily, "I", 14, "0,0,0");
        $this->setStyle("h4i", $this->FontFamily, "I", 14, "0,0,0");        
        $this->setStyle("h4u", $this->FontFamily, "U", 14, "0,0,0");          

        //limpa html
        $html = $this->_htmlClean($html);

        // explode em pedaços
        $a=preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE);
        $txt = ''; 
        foreach($a as $i=>$e) {
            
            //conteúdo
            if($i%2==0){
                $txt .= $e; 
                continue;
            } 
            
            
            //fechamento de tags
            if (substr(trim($e),0,1)=='/'){     
                $tag = strtoupper(str_replace("/","",$e)); 
                if ( !in_array($tag,  $this->htmlTagsParagrafos)){
                    $txt.= '</'.strtolower($tag).'>'; // apenas a tag, sem os attributos
                    continue;
                }
                $txt = $this->_htmlWrite($txt, $margemEsquerda);
                $this->_htmlCloseTag($tag);
                continue;
            }    
               
            
            //abre tags
            $a2=explode(' ',$e);
            $tag=strtoupper(array_shift($a2));
            if ( !in_array($tag, $this->htmlTagsParagrafos)){
                    $txt.= '<'.strtolower($tag).'>'; // apenas a tag, sem os attributos
                    continue;
             }  
            $attr = $this->_htmlExtractAttr($a2); 
            $txt = $this->_htmlWrite($txt, $margemEsquerda);
            $this->_htmlOpenTag($tag,$attr,$margemEsquerda);
        }
        $txt = $this->_htmlWrite($txt, $margemEsquerda);
      
    }
    
    
    
    private function _htmlExtractAttr($a2){
        $attr=array();    
        foreach($a2 as $v){
                if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
                $attr[strtoupper($a3[1])]=$a3[2];
         }
         return $attr;
         
    }
    
    
    private function _htmlWrite($txt, $margemEsquerda){
            if ($this->htmlLastTag){
                foreach ($this->htmlTagsEstilosEspeciais as $tagEspecial)
                   $txt = str_ireplace(array("<$tagEspecial>","</$tagEspecial>"),array("<{$this->htmlLastTag}$tagEspecial>","</{$this->htmlLastTag}$tagEspecial>"), $txt);
            }
            if (trim($txt)){
                $txt = str_replace('<br>',"\n",$txt);
                $this->MultiCellTag(0,$this->_alturaFonte(),stripslashes($this->_htmlTxtEntities($txt)),0,strtoupper($this->htmlAlign[0]),0,$this->htmlIdentacao*5+$margemEsquerda,0);
                return '';
            } 
            return $txt;
    }
    
    

    private function _htmlOpenTag($tag,$attr,$margemEsquerda)
    {
       
        if ($attr['ALIGN']){
        $this->htmlAlign=$attr['ALIGN'];
       } 
        switch($tag){
            case 'H1':
                $this->Ln(5);
                $this->SetFontSize(22);
                $this->htmlLastTag=$tag;
                break;
            case 'H2':
                $this->Ln(5);
                $this->SetFontSize(18);
                $this->htmlLastTag=$tag;
                break;
            case 'H3':
                $this->Ln(5);
                $this->SetFontSize(16);
                $this->htmlLastTag=$tag;
                break;
            case 'H4':
                $this->Ln(5);
                $this->SetFontSize(14);
                $this->htmlLastTag=$tag;
                break;
            case 'LI':
                $x = $this->GetX();
                $this->SetX($x+$margemEsquerda);
                $this->Write(5,'»');
                $this->SetX($x);  
                $this->htmlIdentacao++;
                break;
            case 'TR':
                $this->_htmlPutLine();
                break;
            case 'BR':
                break;
            case 'P':
                $this->Ln(5);
                break;
            case 'HR':
                $this->_htmlPutLine();
                break;
        }
        

        
        
    }

    private function _htmlCloseTag($tag)
    {
       
        
        $this->htmlAlign='Left';
        $this->SetFontSize($this->htmlFontSize);
        $this->htmlLastTag='';
        
        if ($tag=='H1' || $tag=='H2' || $tag=='H3' || $tag=='H4'){
            $this->Ln(3);
        }

        if ($tag=='LI'){
            $this->htmlIdentacao--;
        }  
        

    }




    private function _htmlPutLine()
    {
        $this->Ln(2);
        $this->Line($this->GetX(),$this->GetY(),$this->GetX()+187,$this->GetY());
        $this->Ln(3);
    }

    
    public function multiCellEx($w,$texto,$alinhamento,$numMaxLinhas=1){
        $this->multiCell($w, $this->_alturaFonte(),$texto,0,$alinhamento,false,$numMaxLinhas);
    }
    
    
    /**
     *
     * @param type $destinatario dados destinatário
     * @param type $lote numero lote
     * @param type $remetente dados remetente
     * @param type $logo caminho arquivo
     * @param type $tipo 1 boleto 2 carta
     */
    public function addVerso($destinatario=' ',$lote=' ',$remetente=' ',$logo='',$tipo='',$fontecep=''){
            if($tipo == 1)
                $textoAuxiliar = 'TÍTULO PARA PAGAMENTO';
            $this->AddPage();           
            $this->SetAutoPageBreak(false);
            $this->AliasNbPages();
            
            $this->SetTextColor(100);
            $this->SetFont('arial', 'B', 14);
            $this->SetXY(72, 120);
            $this->multiCell(80, 4, $textoAuxiliar, 0, "L");            
            
            $this->SetTextColor(0);
            $this->SetFont('arial', 'B', 8);
            $this->SetXY(42, 126);
            $this->multiCell(127, 28, ' ', 1, "L");

            if(trim($fontecep)){
                $this->Image($fontecep,43, 128,62,3);
            }else{
                $this->SetFont('arial', 'B', 9);
                $this->SetXY(47, 128);
                $this->multiCell(80, 4, 'Destinatário', 0, "L");
            }
            
            $this->SetFont('arial', '', 8);
            $this->SetXY(47, 128);
            $this->multiCell(130, 4, "\n".$destinatario,0, "L");
            
            $this->SetXY(42, 155);
            $this->multiCell(127, 29, ' ', 1, "L");            

            $this->SetFont('arial', '', 8);
            $this->SetXY(39, 177);
            $this->multiCell(122, 7, $lote,0, "C");
            
            $this->SetTextColor(110);
            $this->SetFont('arial', 'B', 8);
            $this->SetXY(130, 235);
            $this->multiCell(80, 4, 'Para uso dos correios', 0, "L");
            
            $this->SetTextColor(0);
            $this->SetFont('arial', '', 6);
            $this->SetXY(108, 239);
            $this->multiCell(64, 16, ' ', 1, "L");

            $this->SetXY(100, 237);
            $infoCorreio = "
                (  )Mudou-se                               (  )Não procurado
                (  )Endereço insuficiente             (  )Ausente
                (  )Não existe nº indicado            (  )Falecido
                (  )Desconhecido                         (  )Informação escrita por 3º
                (  )Recusado                                (  )CEP errado ou não inform.";
            $this->multiCell(80, 3, $infoCorreio, 0, "L");
                       
            $this->SetXY(173, 239);
            $this->multiCell(22, 28, ' ', 1, "C");
            
            $this->SetXY(173, 238);
            $this->multiCell(22, 5, 'Entregador', 0, "C");            
            
            $this->SetXY(108, 256);
            $this->multiCell(27, 11, ' ', 1, "L");
            
            $this->SetXY(108, 255);
            $this->multiCell(75, 5, 'Data', 0, "L");
            
            $this->SetXY(136, 256);
            $this->multiCell(36, 11, ' ', 1, "L");
            
            $this->SetXY(136, 255);
            $this->multiCell(75, 5, 'Registrado ao serviço postal em', 0, "L");

            $this->SetXY($this->_marcaContagemX, 216);
            $this->multiCell(17, 8, ' ', 0, "L",1);
            if($this->_marcaContagemX >= 165)
                $this->_marcaContagemX = 12;
            else
                $this->_marcaContagemX += 17;
            
            $this->Logo($logo, 46, 273);

            $this->SetFont('arial', '', 8);
            $this->SetXY(69, 282);
            $this->multiCell(60, 3, $remetente,0, "L");
            
            $this->SetTextColor(110);
            $this->SetFont('arial', 'B', 9);
            $this->SetXY(69, 277);
            $this->multiCell(80, 4, 'Remetente', 0, "L");
            $this->SetTextColor(0);
    }
    
    public function AddPage($orientation='', $format='', $countPage =true, $hideFooter = false) {
        $this->_footer[$this->page + 1] = !$hideFooter;
        if (!$countPage)
            $this->_footer[$this->page + 1] = false;
        parent::AddPage($orientation, $format);
        if ($countPage)
            $this->_numPageNum++;
    }

    public function PageNo() {
        return $this->_numPageNum;
    }
    /**
     * adiciona um item ao indice
     * 
     */
    public function indice($txt, $level=0) {
        $this->_toc[] = array('t' => $txt, 'l' => $level, 'p' => $this->_numPageNum);
    }
    /**
     * Há um problema de alinhamento e quebra de linha nas variáveis 
     * então, reduzimos o seu nome a indices que 
     * 
     * @param type $txt
     * @return type 
     */
    public function getNomeReduzidoVar($txt) {
        if (is_array($txt)) $txt = $txt[1]; //resultado da expressao regular
        //$txt = md5($txt);
        if (!is_int($this->_vars[$txt])){
            $this->_vars[$txt] = count($this->_vars);
        }    
        return '|'. str_pad($this->_vars[$txt],4,'0',STR_PAD_LEFT).'|';
    }    
    
/*
    public function insertTOC($location=1, $labelSize=20, $entrySize=10, $tocfont='Helvetica', $label='Índice'
    ) {
        //make toc at end
        $this->stopPageNums();
        $this->AddPage();
        $tocstart = $this->page;

        $this->SetFont($tocfont, 'B', $labelSize);
        $this->Cell(0, 5, $label, 0, 1, 'C');
        $this->Ln(10);

        foreach ($this->_toc as $t) {

            //Offset
            $level = $t['l'];
            if ($level > 0)
                $this->Cell($level * 8);
            $weight = '';
            if ($level == 0)
                $weight = 'B';
            $str = $t['t'];
            $this->SetFont($tocfont, $weight, $entrySize);
            $strsize = $this->GetStringWidth($str);
            $this->Cell($strsize + 2, $this->FontSize + 2, $str);

            //Filling dots
            $this->SetFont($tocfont, '', $entrySize);
            $PageCellSize = $this->GetStringWidth($t['p']) + 2;
            $w = $this->w - $this->lMargin - $this->rMargin - $PageCellSize - ($level * 8) - ($strsize + 2);
            $nb = $w / $this->GetStringWidth('.');
            $dots = str_repeat('.', $nb);
            $this->Cell($w, $this->FontSize + 2, $dots, 0, 0, 'R');

            //Page number
            $this->Cell($PageCellSize, $this->FontSize + 2, $t['p'], 0, 1, 'R');
        }

        //Grab it and move to selected location
        $n = $this->page;
        $n_toc = $n - $tocstart + 1;
        $last = array();

        //store toc pages
        for ($i = $tocstart; $i <= $n; $i++){
            $last[] = $this->pages[$i];
        }    

        //move pages
        for ($i = $tocstart - 1; $i >= $location - 1; $i--){
            $this->pages[$i + $n_toc] = $this->pages[$i];
        }    

        //Put toc pages at insert point
        for ($i = 0; $i < $n_toc; $i++){
            $this->pages[$location + $i] = $last[$i];
        }    
    }*/
    
    public function guias($distancia=10){
        $this->lmargin = $this->tmargin = $this->rmargin = $this->bmargin = 0;

        //horizontal
        $y=0;
        while ($this->tmargin + $y < $this->h - $this->tmargin - $this->bmargin  ){
            $this->Line($this->lmargin,$this->tmargin + $y,$this->w - $this->lmargin ,$this->tmargin+ $y);
            $y+=$distancia;
            if ($y  < $this->h - ($this->tmargin) - $this->bmargin - 2* $distancia ){
                $this->setXY($this->lmargin + $distancia ,$this->tmargin+ $y);
                $this->write(5,'y:'.$y); 
            }
        } 

        //vertical
        $x=0;
        while ($this->lmargin + $x < $this->w - $this->lmargin ){   
            $this->Line($this->lmargin + $x,$this->tmargin,$this->lmargin + $x,$this->h - $this->tmargin - $this->bmargin );
            $x+=$distancia;
            if ($x   < $this->w - $this->lmargin - $this->rmargin - 2*$distancia ){
                $this->setXY($x+ $this->lmargin ,  $this->tmargin );
                $this->write(5,'x:'.$x); 
            }           
        }
    }

    public function Header() {
        if (!$this->_footer[$this->page])
            return;
        if ($this->_footerData['impressoEm']){
            $separador = ($this->_footerData['impressoPor']=='') ? 'Emitido em ' : ' em ';
        }else $separador = '';
        
        $header = $this->_footerData['impressoPor'].$separador.$this->_footerData['impressoEm'];
        $this->SetY(2);
        $this->SetFont('Arial', '', 7);
        $this->SetTextColor(170, 170, 170);
        $this->MultiCell($this->maxColunas, 4, $header, 0, 'C');
        $this->SetY($this->tMargin);
    }

    public function Footer() {
        if (!$this->_footer[$this->page])
            return;      
        $tamanhoLogo = $this->_footerData['logoRetangular'] ? 3 * $this->cm : 2 * $this->cm;
        $this->SetY(-27);
        $y = $this->GetY();
        $x = $this->GetX();
        if (count($this->_footerData['footer'])== 3){
            $this->SetTextColor(0, 0, 0);
            $this->SetDrawColor(0, 0, 0);
            $this->Line($x + 4 + $tamanhoLogo, $y + 4, $x + 100, $y + 4);
        }
        
        $x = $this->GetX();
        $y = $this->GetY();
        $this->SetX($x + 2);
        if (is_file($this->_footerData['logo'])) {
            $this->Image($this->_footerData['logo'], $x, $y + 1, $tamanhoLogo , 2 * $this->cm);
        }
        $this->SetY($y + 4);
        $this->SetX($x + 4 + $tamanhoLogo);        
        if (count($this->_footerData['footer'])== 3){
            $this->SetFont('Arial', 'B', 7);
            $this->MultiCell($this->maxColunas - 2, 3, $this->_footerData['footer'][0], 0, 'L');
            $this->SetX($x + 4 + $tamanhoLogo);
            $this->SetFont('Arial', '', 7);
            $this->MultiCell($this->maxColunas - 2, 3, $this->_footerData['footer'][1], 0, 'L');
            $this->SetX($x + 4 + $tamanhoLogo);
            $y = $this->GetY();
            $this->MultiCell($this->maxColunas - 2, 3, $this->_footerData['footer'][2], 0, 'L');
        }
        $this->SetX($x);
        $this->SetY($y);
        if ($this->_footerData['comPaginacao'])
            $this->MultiCell($this->maxColunas - 2, 3, "{$this->PageNo()} de |nb|", 0, 'R');
    }

    public function setFooterAndHeader($footer1, $footer2, $footer3, $logoFile=null, $logoRetangular=false, $impressoPor='', $impressoEm='', $comPaginacao=true) {
        $footer = (trim($footer1.$footer2.$footer3) == '') ? array() : array(trim($footer1), trim($footer2), trim($footer3));
        $this->_footerData = array('footer' => $footer,
            'logo' => $logoFile,
            'logoRetangular' => $logoRetangular,
            'impressoPor' => $impressoPor,
            'impressoEm' => $impressoEm,
            'comPaginacao' => $comPaginacao);
    }

    function AliasNbPages($alias='|nb|') {
        //Define an alias for total number of pages
        // $this->AliasNbPages=$alias;
    }

    public function _putpages() {
        
        $this->AliasNbPages = '';
        
        //Cria a lista de variaveis
        $replace = array('|nb|' => $this->_numPageNum);
        foreach ($this->_toc as $t) {
           $var =  $this->getNomeReduzidoVar($t['t']);
           $value = '  '. str_pad( $t['p'],  4, '0',STR_PAD_LEFT); // para manter o alinhamento fixa o tamanho do retorno em 6 caracteres
           $replace[$var] = $value; 
        }
      //  print_r($replace); print_r($this->_vars); die();
        //substitui variaveis
        $nb = $this->page;
        for ($n = 1; $n <= $nb; $n++){
            $page = $this->getPage($n);
            $page = str_replace(array_keys($replace), array_values($replace) , $page);
            $page = preg_replace('/\|[0-9]{4}\|/', '', $page);
            $this->setPage($n,  $page );    
        }    
        parent::_putpages();
    }
    
    
    function logo($file, $x=null, $y=null){
        if (!is_file($file)) return;
        $info = getimagesize($file);
        $paisagem = ($info[0] / $info[1] > 1.125);
        $tamanhoLogo = $paisagem ? 3 * $this->cm : 2 * $this->cm;
        if($paisagem) $x -= 8;
        return $this->Image($file, $x, $y, $tamanhoLogo , 2 * $this->cm);

    }

    /*     * ***************************************************************************** 
     *                                                                              * 
     *                               Public methods                                 * 
     *                                                                              * 
     * ***************************************************************************** */

    function Image($file, $x=null, $y=null, $w=0, $h=0, $type='', $link='', $isMask=false, $maskImg=0) {
        

        //Put an image on the page 
        if (!isset($this->images[$file])) {
            //First use of image, get info 
            if ($type == '') {
                $pos = strrpos($file, '.');
                if (!$pos)
                    $this->Error('Image file has no extension and no type was specified: ' . $file);
                $type = substr($file, $pos + 1);
            }
            $type = strtolower($type);
            $mqr = ini_set("magic_quotes_runtime", ''); // deprecated $mqr = get_magic_quotes_runtime();
            ini_set("magic_quotes_runtime", 0); // deprecated set_magic_quotes_runtime(0);
            if ($type == 'jpg' || $type == 'jpeg')
                $info = $this->_parsejpg($file);
            elseif ($type == 'png') {
                $info = $this->_parsepng($file);
                if ($info == 'alpha')
                    return $this->ImagePngWithAlpha($file, $x, $y, $w, $h, $link);
            }
            else {
                //Allow for additional formats 
                $mtd = '_parse' . $type;
                if (!method_exists($this, $mtd))
                    $this->Error('Unsupported image type: ' . $type);
                $info = $this->$mtd($file);
            }
            ini_set("magic_quotes_runtime", $mqr); // deprecated set_magic_quotes_runtime($mqr);

            if ($isMask) {
                $info['cs'] = "DeviceGray"; // try to force grayscale (instead of indexed) 
            }
            $info['i'] = count($this->images) + 1;
            if ($maskImg > 0)
                $info['masked'] = $maskImg;
            $this->images[$file] = $info;
        }
        else
            $info=$this->images[$file];
        //Automatic width and height calculation if needed 
        if ($w == 0 && $h == 0) {
            //Put image at 72 dpi 
            $w = $info['w'] / $this->k;
            $h = $info['h'] / $this->k;
        }
        if ($w == 0)
            $w = $h * $info['w'] / $info['h'];
        if ($h == 0)
            $h = $w * $info['h'] / $info['w'];


        //Flowing mode
        if ($y === null) {
            if ($this->y + $h > $this->PageBreakTrigger && !$this->InHeader && !$this->InFooter && $this->AcceptPageBreak()) {
                //Automatic page break
                $x2 = $this->x;
                $this->AddPage($this->CurOrientation, $this->CurPageFormat);
                $this->x = $x2;
            }
            $y = $this->y;
            $this->y+=$h;
        }
        if ($x === null)
            $x = $this->x;

        
        if ($isMask)
            $x = $this->fwPt + 1000; // embed hidden, ouside the canvas   
        $this->_out(sprintf('q %.2f 0 0 %.2f %.2f %.2f cm /I%d Do Q', $w * $this->k, $h * $this->k, $x * $this->k, ($this->h - ($y + $h)) * $this->k, $info['i']));
        if ($link)
            $this->Link($x, $y, $w, $h, $link);
        
        return $info['i'];
    }

// needs GD 2.x extension 
// pixel-wise operation, not very fast 
    function ImagePngWithAlpha($file, $x, $y, $w=0, $h=0, $link='') {
        $tmp_alpha = tempnam(Superlogica_App::getCacheDir(), 'mska');
        $this->tmpFiles[] = $tmp_alpha;
        $tmp_plain = tempnam(Superlogica_App::getCacheDir(), 'mskp');
        $this->tmpFiles[] = $tmp_plain;

        list($wpx, $hpx) = getimagesize($file);
        $img = imagecreatefrompng($file);
        $alpha_img = imagecreate($wpx, $hpx);

        // generate gray scale pallete 
        for ($c = 0; $c < 256; $c++)
            ImageColorAllocate($alpha_img, $c, $c, $c);

        // extract alpha channel 
        $xpx = 0;
        while ($xpx < $wpx) {
            $ypx = 0;
            while ($ypx < $hpx) {
                $color_index = imagecolorat($img, $xpx, $ypx);
                $col = imagecolorsforindex($img, $color_index);
                imagesetpixel($alpha_img, $xpx, $ypx, $this->_gamma((127 - $col['alpha']) * 255 / 127));
                ++$ypx;
            }
            ++$xpx;
        }

        imagepng($alpha_img, $tmp_alpha);
        imagedestroy($alpha_img);

        // extract image without alpha channel 
        $plain_img = imagecreatetruecolor($wpx, $hpx);
        imagecopy($plain_img, $img, 0, 0, 0, 0, $wpx, $hpx);
        imagepng($plain_img, $tmp_plain);
        imagedestroy($plain_img);

        //first embed mask image (w, h, x, will be ignored) 
         $maskImg = $this->Image($tmp_alpha, 0, 0, 0, 0, 'PNG', '', true); 
        //embed image, masked with previously embedded mask 
        $this->Image($tmp_plain, $x, $y, $w, $h, 'PNG', $link, false, $maskImg);
    }

    function Close() {
        parent::Close();
        // clean up tmp files 
        foreach ($this->tmpFiles as $tmp)
            @unlink($tmp);
    }

    /*     * ***************************************************************************** 
     *                                                                              * 
     *                               Private methods                                * 
     *                                                                              * 
     * ***************************************************************************** */

    function _putimages() {
        $filter = ($this->compress) ? '/Filter /FlateDecode ' : '';
        reset($this->images);
        while (list($file, $info) = each($this->images)) {
            $this->_newobj();
            $this->images[$file]['n'] = $this->n;
            $this->_out('<</Type /XObject');
            $this->_out('/Subtype /Image');
            $this->_out('/Width ' . $info['w']);
            $this->_out('/Height ' . $info['h']);

            if (isset($info["masked"]))
                $this->_out('/SMask ' . ($this->n - 1) . ' 0 R');

            if ($info['cs'] == 'Indexed')
                $this->_out('/ColorSpace [/Indexed /DeviceRGB ' . (strlen($info['pal']) / 3 - 1) . ' ' . ($this->n + 1) . ' 0 R]');
            else {
                $this->_out('/ColorSpace /' . $info['cs']);
                if ($info['cs'] == 'DeviceCMYK')
                    $this->_out('/Decode [1 0 1 0 1 0 1 0]');
            }
            $this->_out('/BitsPerComponent ' . $info['bpc']);
            if (isset($info['f']))
                $this->_out('/Filter /' . $info['f']);
            if (isset($info['parms']))
                $this->_out($info['parms']);
            if (isset($info['trns']) && is_array($info['trns'])) {
                $trns = '';
                for ($i = 0; $i < count($info['trns']); $i++)
                    $trns.=$info['trns'][$i] . ' ' . $info['trns'][$i] . ' ';
                $this->_out('/Mask [' . $trns . ']');
            }
            $this->_out('/Length ' . strlen($info['data']) . '>>');
            $this->_putstream($info['data']);
            unset($this->images[$file]['data']);
            $this->_out('endobj');
            //Palette 
            if ($info['cs'] == 'Indexed') {
                $this->_newobj();
                $pal = ($this->compress) ? gzcompress($info['pal']) : $info['pal'];
                $this->_out('<<' . $filter . '/Length ' . strlen($pal) . '>>');
                $this->_putstream($pal);
                $this->_out('endobj');
            }
        }
    }

// GD seems to use a different gamma, this method is used to correct it again 
    function _gamma($v) {
        return pow($v / 255, 2.2) * 255;
    }

// this method overwriting the original version is only needed to make the Image method support PNGs with alpha channels. 
// if you only use the ImagePngWithAlpha method for such PNGs, you can remove it from this script. 
    function _parsepng($file) {
        //Extract info from a PNG file 
        $f = fopen($file, 'rb');
        if (!$f)
            $this->Error('Can\'t open image file: ' . $file);
        //Check signature 
        if (fread($f, 8) != chr(137) . 'PNG' . chr(13) . chr(10) . chr(26) . chr(10))
            $this->Error('Not a PNG file: ' . $file);
        //Read header chunk 
        fread($f, 4);
        if (fread($f, 4) != 'IHDR')
            $this->Error('Incorrect PNG file: ' . $file);
        $w = $this->_freadint($f);
        $h = $this->_freadint($f);
        $bpc = ord(fread($f, 1));
        if ($bpc > 8)
            $this->Error('16-bit depth not supported: ' . $file);
        $ct = ord(fread($f, 1));
        if ($ct == 0)
            $colspace = 'DeviceGray';
        elseif ($ct == 2)
            $colspace = 'DeviceRGB';
        elseif ($ct == 3)
            $colspace = 'Indexed';
        else {
            fclose($f);      // the only changes are 
            return 'alpha';  // made in those 2 lines 
        }
        if (ord(fread($f, 1)) != 0)
            $this->Error('Unknown compression method: ' . $file);
        if (ord(fread($f, 1)) != 0)
            $this->Error('Unknown filter method: ' . $file);
        if (ord(fread($f, 1)) != 0)
            $this->Error('Interlacing not supported: ' . $file);
        fread($f, 4);
        $parms = '/DecodeParms <</Predictor 15 /Colors ' . ($ct == 2 ? 3 : 1) . ' /BitsPerComponent ' . $bpc . ' /Columns ' . $w . '>>';
        //Scan chunks looking for palette, transparency and image data 
        $pal = '';
        $trns = '';
        $data = '';
        do {
            $n = $this->_freadint($f);
            $type = fread($f, 4);
            if ($type == 'PLTE') {
                //Read palette 
                $pal = fread($f, $n);
                fread($f, 4);
            } elseif ($type == 'tRNS') {
                //Read transparency info 
                $t = fread($f, $n);
                if ($ct == 0)
                    $trns = array(ord(substr($t, 1, 1)));
                elseif ($ct == 2)
                    $trns = array(ord(substr($t, 1, 1)), ord(substr($t, 3, 1)), ord(substr($t, 5, 1)));
                else {
                    $pos = strpos($t, chr(0));
                    if ($pos !== false)
                        $trns = array($pos);
                }
                fread($f, 4);
            }
            elseif ($type == 'IDAT') {
                //Read image data block 
                $data.=fread($f, $n);
                fread($f, 4);
            } elseif ($type == 'IEND')
                break;
            else
                fread($f, $n + 4);
        }
        while ($n);
        if ($colspace == 'Indexed' && empty($pal))
            $this->Error('Missing palette in ' . $file);
        fclose($f);
        return array('w' => $w, 'h' => $h, 'cs' => $colspace, 'bpc' => $bpc, 'f' => 'FlateDecode', 'parms' => $parms, 'pal' => $pal, 'trns' => $trns, 'data' => $data);
    }

    function _freadint($f) {
        //Read a 4-byte integer from file
        $i = ord(fread($f, 1)) << 24;
        $i+=ord(fread($f, 1)) << 16;
        $i+=ord(fread($f, 1)) << 8;
        $i+=ord(fread($f, 1));
        return $i;
    }
/**
 * Faz o strikeout
 * 
 * @param type $x
 * @param type $y
 * @param type $txt
 * @return type 
 */
function _dostrikeout($x, $y, $txt)
{
	//Underline text
	$up=$this->CurrentFont['up'];
	$ut=$this->CurrentFont['ut'];
	$w=$this->GetStringWidth($txt)+$this->ws*substr_count($txt,' ');
        $tamanhoFonte = $up/1000*$this->FontSize;
        $tamanhoFonte =1; // fixo, precisa acompanhar o tamanho da fonte
	return sprintf('%.2F %.2F %.2F %.2F re f',$x*$this->k,($this->h-($y-$tamanhoFonte))*$this->k,$w*$this->k,-$ut/1000*$this->FontSizePt);
}
/**
 * text com Strikeout
 * 
 * @param type $x
 * @param type $y
 * @param type $txt 
 */
function Text($x, $y, $txt)
{

       
        //Output a string
	$s=sprintf('BT %.2F %.2F Td (%s) Tj ET',$x*$this->k,($this->h-$y)*$this->k,$this->_escape($txt));
	if($this->underline && $txt!='')
		$s.=' '.$this->_dounderline($x,$y,$txt);
	if($this->strikeout && $txt!='')
		$s.=' '.$this->_dostrikeout($x,$y,$txt);        
	if($this->ColorFlag)
		$s='q '.$this->TextColor.' '.$s.' Q';
	$this->_out($s);
}

/**
 * Cell com Strikeout
 * @param type $x
 * @param type $y
 * @param type $txt 
 */
function Cell($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
{
	$k=$this->k;
	if($this->y+$h>$this->PageBreakTrigger && !$this->InHeader && !$this->InFooter && $this->AcceptPageBreak())
	{
		//Automatic page break
		$x=$this->x;
		$ws=$this->ws;
		if($ws>0)
		{
			$this->ws=0;
			$this->_out('0 Tw');
		}
		$this->AddPage($this->CurOrientation,$this->CurPageFormat);
		$this->x=$x;
		if($ws>0)
		{
			$this->ws=$ws;
			$this->_out(sprintf('%.3F Tw',$ws*$k));
		}
	}
	if($w==0)
		$w=$this->w-$this->rMargin-$this->x;
	$s='';
	if($fill || $border==1)
	{
		if($fill)
			$op=($border==1) ? 'B' : 'f';
		else
			$op='S';
		$s=sprintf('%.2F %.2F %.2F %.2F re %s ',$this->x*$k,($this->h-$this->y)*$k,$w*$k,-$h*$k,$op);
	}
	if(is_string($border))
	{
		$x=$this->x;
		$y=$this->y;
		if(strpos($border,'L')!==false)
			$s.=sprintf('%.2F %.2F m %.2F %.2F l S ',$x*$k,($this->h-$y)*$k,$x*$k,($this->h-($y+$h))*$k);
		if(strpos($border,'T')!==false)
			$s.=sprintf('%.2F %.2F m %.2F %.2F l S ',$x*$k,($this->h-$y)*$k,($x+$w)*$k,($this->h-$y)*$k);
		if(strpos($border,'R')!==false)
			$s.=sprintf('%.2F %.2F m %.2F %.2F l S ',($x+$w)*$k,($this->h-$y)*$k,($x+$w)*$k,($this->h-($y+$h))*$k);
		if(strpos($border,'B')!==false)
			$s.=sprintf('%.2F %.2F m %.2F %.2F l S ',$x*$k,($this->h-($y+$h))*$k,($x+$w)*$k,($this->h-($y+$h))*$k);
	}
	if($txt!=='')
	{
		if($align=='R')
			$dx=$w-$this->cMargin-$this->GetStringWidth($txt);
		elseif($align=='C')
			$dx=($w-$this->GetStringWidth($txt))/2;
		else
			$dx=$this->cMargin;
		if($this->ColorFlag)
			$s.='q '.$this->TextColor.' ';
		$txt2=str_replace(')','\\)',str_replace('(','\\(',str_replace('\\','\\\\',$txt)));
		$s.=sprintf('BT %.2F %.2F Td (%s) Tj ET',($this->x+$dx)*$k,($this->h-($this->y+.5*$h+.3*$this->FontSize))*$k,$txt2);
		if($this->underline)
			$s.=' '.$this->_dounderline($this->x+$dx,$this->y+.5*$h+.3*$this->FontSize,$txt);
		if($this->strikeout)
			$s.=' '.$this->_dostrikeout($this->x+$dx,$this->y+.5*$h+.3*$this->FontSize,$txt);                
		if($this->ColorFlag)
			$s.=' Q';
		if($link)
			$this->Link($this->x+$dx,$this->y+.5*$h-.5*$this->FontSize,$this->GetStringWidth($txt),$this->FontSize,$link);
	}
	if($s)
		$this->_out($s);
	$this->lasth=$h;
	if($ln>0)
	{
		//Go to next line
		$this->y+=$h;
		if($ln==1)
			$this->x=$this->lMargin;
	}
	else
		$this->x+=$w;
}
/**
 * Set font com suporte strikeout
 * @param type $family
 * @param type $style
 * @param type $size
 * @return type 
 */
function SetFont($family, $style='', $size=0)
{

	$style=strtoupper($style);
	if(strpos($style,'S')!==false)
	{
		$this->strikeout=true;
		$style=str_replace('S','',$style);
	} else 
            $this->strikeout=false;
        return parent::setFont($family, $style, $size);
}       


 /**
  * Multicell com suporte a maxline
  * 
  */
  function MultiCell($w, $h, $txt, $border=0, $align='J', $fill=false, $maxline=0)
    {
        //Output text with automatic or explicit line breaks, at most $maxline lines
        $cw=&$this->CurrentFont['cw'];
        if($w==0)
            $w=$this->w-$this->rMargin-$this->x;
        $wmax=($w-2*$this->cMargin)*1000/$this->FontSize;
        $s=str_replace("\r",'',$txt);
        $nb=strlen($s);
        if($nb>0 && $s[$nb-1]=="\n")
            $nb--;
        $b=0;
        if($border)
        {
            if($border==1)
            {
                $border='LTRB';
                $b='LRT';
                $b2='LR';
            }
            else
            {
                $b2='';
                if(is_int(strpos($border,'L')))
                    $b2.='L';
                if(is_int(strpos($border,'R')))
                    $b2.='R';
                $b=is_int(strpos($border,'T')) ? $b2.'T' : $b2;
            }
        }
        $sep=-1;
        $i=0;
        $j=0;
        $l=0;
        $ns=0;
        $nl=1;
        while($i<$nb)
        {
            //Get next character
            $c=$s[$i];
            if($c=="\n")
            {
                //Explicit line break
                if($this->ws>0)
                {
                    $this->ws=0;
                    $this->_out('0 Tw');
                }
                $this->Cell($w,$h,substr($s,$j,$i-$j),$b,2,$align,$fill);
                $i++;
                $sep=-1;
                $j=$i;
                $l=0;
                $ns=0;
                $nl++;
                if($border && $nl==2)
                    $b=$b2;
                if($maxline && $nl>$maxline)
                    return substr($s,$i);
                continue;
            }
            if($c==' ')
            {
                $sep=$i;
                $ls=$l;
                $ns++;
            }
            $l+=$cw[$c];
            if($l>$wmax)
            {
                //Automatic line break
                if($sep==-1)
                {
                    if($i==$j)
                        $i++;
                    if($this->ws>0)
                    {
                        $this->ws=0;
                        $this->_out('0 Tw');
                    }
                    $this->Cell($w,$h,substr($s,$j,$i-$j),$b,2,$align,$fill);
                }
                else
                {
                    if($align=='J')
                    {
                        $this->ws=($ns>1) ? ($wmax-$ls)/1000*$this->FontSize/($ns-1) : 0;
                        $this->_out(sprintf('%.3F Tw',$this->ws*$this->k));
                    }
                    $this->Cell($w,$h,substr($s,$j,$sep-$j),$b,2,$align,$fill);
                    $i=$sep+1;
                }
                $sep=-1;
                $j=$i;
                $l=0;
                $ns=0;
                $nl++;
                if($border && $nl==2)
                    $b=$b2;
                if($maxline && $nl>$maxline)
                {
                    if($this->ws>0)
                    {
                        $this->ws=0;
                        $this->_out('0 Tw');
                    }
                    return substr($s,$i);
                }
            }
            else
                $i++;
        }
        //Last chunk
        if($this->ws>0)
        {
            $this->ws=0;
            $this->_out('0 Tw');
        }
        if($border && is_int(strpos($border,'B')))
            $b.='B';
        $this->Cell($w,$h,substr($s,$j,$i-$j),$b,2,$align,$fill);
        $this->x=$this->lMargin;
        return '';
    }


  
}

?>