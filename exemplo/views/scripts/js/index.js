Superlogica_Js_Form.implement({

__recarregarGrids : function(form,response){
        if ( response.isValid()){
            var grid = new Superlogica_Js_Grid('#Grids_Index0');
            grid.recarregar();
        }
   }
});