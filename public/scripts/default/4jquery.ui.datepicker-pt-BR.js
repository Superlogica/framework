/* Brazilian initialisation for the jQuery UI date picker plugin. */
/* Written by Leonildo Costa Silva (leocsilva@gmail.com). */

jQuery.datepicker.regional['pt-BR'] = {
    closeText: 'Fechar',
    prevText: '&#x3c;Anterior',
    nextText: 'Pr&oacute;ximo&#x3e;',
    currentText: 'Hoje',
    monthNames: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun',
    'Jul','Ago','Set','Out','Nov','Dez'],
    dayNames: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'],
//    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
//    dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
    dayNamesShort: ['D','S','T','Q','Q','S','S'],
    dayNamesMin: ['D','S','T','Q','Q','S','S'],
    weekHeader: 'Sm',
    dateFormat: 'dd/mm/yy',
    firstDay: 0,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
};
jQuery.datepicker.setDefaults(jQuery.datepicker.regional['pt-BR']);

/**
 * Fazer botão de "Hoje" selecionar a data no calendário
 * @see http://www.blrf.net/howto/50_jQuery__How_to_select_Today_for_Datepicker_.html
 */
var _gotoToday = jQuery.datepicker._gotoToday;
jQuery.datepicker._gotoToday = function(a){
    var target = jQuery(a);
    var inst = this._getInst(target[0]);
    _gotoToday.apply( this, arguments );
    jQuery.datepicker._selectDate(a, jQuery.datepicker._formatDate(inst,inst.selectedDay, inst.selectedMonth, inst.selectedYear) );
};