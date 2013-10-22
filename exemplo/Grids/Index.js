var Grids_Index = new Class({
    
    Extends : Superlogica_Js_Grid,
    
    _formatarRodape : function(){
        var totalFornecedores = Object.getLength( this.getData() );
        var msgFornecedores = '<b>Listando '+ totalFornecedores + ' fornecedores.</b>';
        return [ msgFornecedores, null, null, null, null];
    }    
    
});