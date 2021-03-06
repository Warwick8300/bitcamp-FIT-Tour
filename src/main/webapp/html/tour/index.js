var pageNo = 1,
pageSize = 3,
prevPageLi = $('#prevPage'),
nextPageLi = $('#nextPage'),
currSpan = $('#currPage > span'),
crumb = $('#breadcrumb-list'),
countrytemplateSrc = $('#tr-template-for-country').html(),
citytemplateSrc = $('#tr-template-for-city').html(),
templateSrc = $('#tr-template').html(),
themetemplateSrc = $('#tr-template-for-theme').html();
//script 태그에서 템플릿 데이터를 꺼낸다.

var continentName = '',
    countryName = '',
    cityName= '';
var firstcrumb = crumb.children().eq(0),
    secondcrumb = crumb.children().eq(1),
    thirdcrumb = crumb.children().eq(2);
var temp;
var minPrice = 0,
    maxPrice = 300000;
var currMaxPrice;
var minHour = 1,
    maxHour = 14;
var prevPageBtn = $('#prevPageBtn'),
    nextPageBtn = $('#nextPageBtn'),
    firstPage = $('#firstPage');
var totalpage;
var orderby = "tourDesc";
var theme = [];
var keyword ='';
var rowCount;

//Handlebars를 통해 템플릿 데이터를 가지고 최종 결과를 생성할 함수를 준비한다.
var countrytrGenerator = Handlebars.compile(countrytemplateSrc),
citytrGenerator = Handlebars.compile(citytemplateSrc),
trGenerator = Handlebars.compile(templateSrc),
themetrGenerator = Handlebars.compile(themetemplateSrc);

M.AutoInit();
var elem = document.querySelector('.collapsible.expandable');
var instance = M.Collapsible.init(elem, {
  accordion: false
});

$( document ).ready( function() {
  var jbOffset = $( '.navigation' ).offset();
  var jbOffset2 = $('.collapsible').offset();
  
  var scrollBottom = $("body").height() - $(window).height() - $(window).scrollTop(); //스크롤바텀값
  
  $( window ).scroll( function() {
    if ( $( document ).scrollTop() > jbOffset.top || $(document).scrollTop() > jbOffset2.top) {
      $( '.navigation' ).addClass( 'jbFixed z-depth-3' );
   //   $('.collapsible').addClass('jbFixed2');
    }
    else {
      $( '.navigation' ).removeClass( 'jbFixed z-depth-3' );
   //   $('.collapsible').removeClass('jbFixed2');
    }
  });
} );



//JSON 형식의 데이터 목록 가져오기
function loadList(pn, continentName, countryName, cityName, minPrice, maxPrice, minHour, maxHour, theme, orderby, keyword) {
  $.get('../../app/json/tour/list',
      // ?pageNo=1&pageSize=3&continentName=&countryName=&cityName=&minPrice=0&maxPrice=300000&minHour=1&maxHour=12&orderby=tourDesc
      {
    pageNo : pn,
    pageSize : pageSize,
    continentName : continentName,
    countryName : countryName,
    cityName : cityName,
    minPrice : minPrice,
    maxPrice : maxPrice,
    minHour : minHour,
    maxHour : maxHour,
    theme : theme,
    orderby : orderby,
    keyword : keyword
      },

      function(obj) {
        // 서버에 받은 데이터 중에서 페이지 번호를 글로벌 변수에 저장한다.
        pageNo = obj.pageNo;
        rowCount = obj.rowCount;
        //currMaxPrice = obj.currMaxPrice;
        // TR 태그를 생성하여 테이블 데이터를 갱신한다.
        // 이전에 출력한 내용을 제거한다.
        $('#tourlistcard').html('');
        // 템플릿 엔진을 실행하여 tr 태그 목록을 생성한다. 그리고 바로 ()안에 붙인다.
        if(rowCount == 0) {
          $('.nodata').removeClass('bit-invisible');
          $('.pagination').addClass('bit-invisible');
        } else {
          $('.nodata').addClass('bit-invisible');
          $('.pagination').removeClass('bit-invisible');
        }
        $(trGenerator(obj)).appendTo($('#tourlistcard'));


        var inputText;
        if(continentName) {
          inputText = continentName;
        } 
        if (countryName) {
          inputText = countryName;
        } 
        if (cityName) {
          inputText = cityName;
        } 
        if (!continentName && !countryName && !cityName){
          inputText = 'FIT TOUR';
        }
       $('.temp-text').html(
           '<div class="navtitle">' + inputText +
//           '<br><p class="subText">Travel is fatal to prejudice bigotry and narrow-mindedness</p><div>');
       '<br><p class="subText">TRAVEL IS FATAL TO PREJUDICE BIGOTRY AND NARROW-MINDEDNESS</p><div>');
        
        
        for(listRow of $('.listRow')) {
          $.ajaxSetup({async:false});
          var tourNo = $(listRow).attr('id');
          var targetforTheme = $(listRow).children().eq(1).children().eq(3).children().eq(0);
          var targetforPrice = $(listRow).children().eq(1).children().eq(3).children().eq(1);
          var transportation = $(listRow).children().eq(1).children().eq(2).children().eq(3).html();
          var placeToChange = $(listRow).children().eq(1).children().eq(2).children().eq(3).prev().children().eq(0);
          var targetforPhoto = $(listRow).children().eq(0).children().eq(0);
          addTransportaionIcon(placeToChange, transportation);
          $.getJSON('../../app/json/tour/detail?no=' + tourNo + '&pageSize=' + 8,
              function(data) {
            $(themetrGenerator(data)).appendTo(targetforTheme);
            $(targetforPrice).html(data.tour.price.toLocaleString() + '원');
            $(targetforPhoto).attr('src', '/bitcamp-fit-tour/upload/tourphoto/' + data.tour.tourPhoto[0].name);
          });
          $.ajaxSetup({async:true});
        }

        // 현재 페이지의 번호를 갱신한다.
        currSpan.html(String(pageNo));

        // 1페이지일 경우 버튼을 비활성화 한다.
        if (pageNo == 1) {
          prevPageLi.addClass('disabled');
        } else {
          prevPageLi.removeClass('disabled');
        } 

        // 마지막 페이지일 경우 버튼을 비활성화 한다.
        if (pageNo == obj.totalPage) {
//          console.log('pageNo:' + pageNo);
//          console.log('totalPage:' + obj.totalPage);
          nextPageLi.addClass('disabled');
        } else {
          nextPageLi.removeClass('disabled');
        }

        // 데이터 로딩이 완료되면 body 태그에 이벤트를 전송한다.
        $(document.body).trigger('loaded-list');
        $('.bit-view-link').click((e) => {
          e.preventDefault();
          window.location.href = 'view.html?no=' + 
          $(e.target).attr('data-no');
        });


      }); // Bitcamp.getJSON()

} // loadList()


//페이지를 출력한 후 1페이지 목록을 로딩한다.
getMaxPrice();

if(location.href.split('?')[1]){
  var param = location.href.split('?')[1].split('=')[0];
  if(param == 'city'){
    var city = location.href.split('?')[1].split('=')[1];
    loadList(1, continentName, countryName, decodeURI(city), minPrice, maxPrice, minHour, maxHour, theme, orderby);
  } else if(param == 'keyword'){
    keyword = decodeURI(location.href.split('?')[1].split('=')[1]);
    loadList(1, continentName, countryName, cityName, minPrice, maxPrice, minHour, maxHour, theme, orderby, keyword);
  }
} else {
  loadList(1, continentName, countryName, cityName, minPrice, maxPrice, minHour, maxHour, theme, orderby);
}

$('#prevPage > a').click((e) => {
  e.preventDefault();
  loadList(pageNo - 1, continentName, countryName, cityName, minPrice, maxPrice, minHour, maxHour, theme, orderby, keyword);
});

$('#nextPage > a').click((e) => {
  e.preventDefault();
  loadList(pageNo + 1, continentName, countryName, cityName, minPrice, maxPrice, minHour, maxHour, theme, orderby, keyword);
});

$('#orderbyPrice').click((e) => {
  e.preventDefault();
  orderby = 'priceAsc';
  loadList(1, continentName, countryName, cityName, minPrice, maxPrice, minHour, maxHour, theme, orderby, keyword);
  initOptionSelected();
  $(e.target).addClass('selected');
});

$('#orderbyWishList').click((e) => {
  e.preventDefault();
  orderby = 'wishlistDesc';
  loadList(1, continentName, countryName, cityName, minPrice, maxPrice, minHour, maxHour, theme, orderby, keyword);
  initOptionSelected();
  $(e.target).addClass('selected');
});

$('#orderbyReviews').click((e) => {
  e.preventDefault();
  orderby = 'reviewDesc';
  loadList(1, continentName, countryName, cityName, minPrice, maxPrice, minHour, maxHour, theme, orderby, keyword);
  initOptionSelected();
  $(e.target).addClass('selected');
});

//$( ".collapsible" ).mouseup(function() {
//  $('#searchwithOptions').trigger('click');
//});

$("#collapsible-body-range, #collapsible-body-hour").mouseup(function() {
$('#searchwithOptions').trigger('click');
});


$('#filter-reset').click((e) => {
  initOptionSelected();
  $('#searchwithOptions').trigger('click');
});


$('.continent-list-btn').click((e) => {
  e.preventDefault();
  continentName = $(e.target).html();
  countryName = '';
  cityName = '';
  keyword = '';
  showBreadCrumb(continentName, '', '');
  orderby = 'tourDesc';
  initOptionSelected();
  loadList(1, continentName, '', '', minPrice, maxPrice, minHour, maxHour, theme, orderby);
  history.pushState(null,null, '/bitcamp-fit-tour/html/tour/index.html');
});


$(document.body).bind('nav-list', () => {
  $('.country-list-btn').click((e) => {
    e.preventDefault();
    continentName = $(e.target).attr('id');
    countryName = $(e.target).html();
    cityName = '';
    keyword = '';
    console.log(keyword);
    showBreadCrumb(continentName, countryName, '');
    orderby = 'tourDesc';
    initOptionSelected();
    loadList(1, '', countryName, '', minPrice, maxPrice, minHour, maxHour, theme, orderby);
    history.pushState(null,null, '/bitcamp-fit-tour/html/tour/index.html');
  });
});

$(document.body).bind('nav-list', () => {
  $('.city-list-btn').click((e) => {
    e.preventDefault();
    cityName = $(e.target).html();
    continentName = $(e.target).attr('id').split(',')[0];
    countryName = $(e.target).attr('id').split(',')[1];
    showBreadCrumb(continentName, countryName, cityName);
    orderby = 'tourDesc';
    initOptionSelected();
    keyword = '';
    loadList(1, '', '', cityName, minPrice, maxPrice, minHour, maxHour, theme, orderby);
    history.pushState(null,null, '/bitcamp-fit-tour/html/tour/index.html');
  });
});

$('#secondcrumb').click((e) => {
  e.preventDefault();
  cityName = '';
  showBreadCrumb(continentName, countryName, cityName);
  loadList(1, '', countryName, '', minPrice, maxPrice, minHour, maxHour, theme, orderby);
});

$('#firstcrumb').click((e) => {
  e.preventDefault();
  cityName = '';
  countryName = '';
  showBreadCrumb(continentName, countryName, cityName);
  loadList(1, continentName, '', '', minPrice, maxPrice, minHour, maxHour, theme, orderby);
});

function getMaxPrice() {
  $.get('../../app/json/tour/maxPrice',
      function(obj) {
    currMaxPrice = obj.currMaxPrice;
    $(document.body).trigger('max-price');
  })};

//price slider-range
  $(document.body).bind('max-price', () => {
    $(function () {
      $( "#slider-range-price" ).slider({
        range: true,
        min: 0,
        max: currMaxPrice,
        step: 1000,
        values: [ 0, currMaxPrice ],
        slide: function( event, ui ) {
          $( "#amount" ).val(ui.values[ 0 ].toLocaleString() + "원" + " - " + ui.values[ 1 ].toLocaleString() + "원" );
          minPrice = ui.values[ 0 ];
          maxPrice = ui.values[ 1 ];
        }
      });
      $( "#amount" ).val( $( "#slider-range-price" ).slider( "values", 0 ).toLocaleString() + "원" +
          " -" + $( "#slider-range-price" ).slider( "values", 1 ).toLocaleString() + "원");
    });
  });

//hour slider-range
  $(function() {
    $( "#slider-range-hour" ).slider({
      range: true,
      min: 1,
      max: 14,
      step: 1,
      values: [ 1, 14 ],
      slide: function( event, ui ) {
        $( "#tour-hour" ).val(ui.values[ 0 ] + "시간" + " - " + ui.values[ 1 ] + "시간" );
        minHour = ui.values[ 0 ];
        maxHour = ui.values[ 1 ];
      }
    });
    $( "#tour-hour" ).val( $( "#slider-range-hour" ).slider( "values", 0 ) + "시간" +
        " -" + $( "#slider-range-hour" ).slider( "values", 1 ) + "시간");
  });


  function resetSlider() {
    minHour = 1;
    maxHour = 14;
    minPrice = 0;
    maxPrice = currMaxPrice;
    $("#slider-range-hour").slider("values", 0, 1);  
    $("#slider-range-hour").slider("values", 1, 14 ); 
    $( "#tour-hour" ).val( 1 + "시간" + " -" + 14 + "시간" );

    $("#slider-range-price").slider("values", 0, 0);  
    $("#slider-range-price").slider("values", 1, 250000); 
    $( "#amount" ).val( 0 + "원" + " -" + maxPrice.toLocaleString() + "원" );
  }

//floating menu - search with options
  $('#searchwithOptions').click((e) => {
    e.preventDefault();
    console.log('minPrice:' + minPrice + 'maxPrice' + maxPrice + 'minHour:' + minHour + 'maxHour:' + maxHour + "keyword:" + keyword);
    console.log('theme:' + theme);
    loadList(1, continentName, countryName, cityName, minPrice, maxPrice, minHour, maxHour, theme, orderby, window.keyword);
  });

  $('.mouseOverLeave').hover((e) => {
//    $('.showAll').css("color", "#d6e5e3");
    $('.showAll').addClass('showinBright');
  });

  $('.mouseOverLeave').mouseleave((e) => {
//    $('.showAll').css("color", "#24313C");
    $('.showAll').removeClass('showinBright');
  });

//Dropdowns.
//(function() {
//$('#nav > ul').dropotron({
//mode: 'fade',
//noOpenerFade: true,
//speed: 300,
//alignment: 'center'
//});
//})();

//follow quick menu
//$(window).scroll(function(){
//var scrollTop = $(document).scrollTop();
//if (scrollTop < 235) {
//scrollTop = 235;
//}
//$(".collapsible").stop();
//$(".collapsible").animate( { "top" : scrollTop });
//});

//BreadCrumb
  function showBreadCrumb(continentName, countryName, cityName) {

    firstcrumb.removeClass('bit-invisible');
    firstcrumb.html(continentName);
    secondcrumb.removeClass('bit-invisible');
    secondcrumb.html(countryName);
    temp = thirdcrumb.detach();
    if(cityName != '') {
      secondcrumb.after(temp);
      thirdcrumb.removeClass('bit-invisible');
      thirdcrumb.html(cityName);
    }
  };

  function initOptionSelected() {
    $('#orderbyPrice').removeClass('selected');
    $('#orderbyWishList').removeClass('selected');
    $('#orderbyReviews').removeClass('selected');
    theme = [];
    $("input[type=checkbox]").prop("checked",false);
    resetSlider();
  };




//Add TrpansportaionIcon
  function addTransportaionIcon(placeToChange, transportation) {
    //var transportaionIconTag = $('#transportation-icon');

    switch (transportation) {
    case '버스' :
      placeToChange.addClass('fas fa-bus-alt')
      break;
    case '지하철' :
      placeToChange.addClass('fas fa-subway')
      break;
    case '도보' :
      placeToChange.addClass('fas fa-walking')
      break;
    case '자전거' :
      placeToChange.addClass('fas fa-bicycle')
      break;
    }
  }


  $('input[name="theme"]').change(function() {
    var value = $(this).val();              // value
    var checked = $(this).prop('checked');  // checked 상태 (true, false)
    var $label = $(this).next();            // find a label element
    var checkedtheme = $label.html();
    if(checked) {
      theme.push(checkedtheme);
      console.log(theme);
    //  loadList(1, continentName, countryName, cityName, minPrice, maxPrice, minHour, maxHour, theme, orderby, keyword);
      console.log('checked');
    } else {
      theme = $.grep(theme, function(value) {
        return value != checkedtheme;
      });
      console.log(theme);
   //   loadList(1, continentName, countryName, cityName, minPrice, maxPrice, minHour, maxHour, theme, orderby, keyword);
      console.log('unchecked');
    }
    $('#searchwithOptions').trigger('click');
  });

  var arrays = ['유럽', '아시아', '아메리카', '오세아니아', '아프리카'];
  var arrays2 = ['#countryWithContinentforEU', '#countryWithContinentforAsia', '#countryWithContinentAmerica', '#countryWithContinentOceania', '#countryWithContinentAfrica'];
  NavList(arrays, arrays2);
  var i = 0;
  function NavList(arrays, arrays2) {
    for (var i = 0; i < arrays.length; i++){
      $.ajaxSetup({async:false});
      $.getJSON('../../app/json/tour/regCountry?continent=' + arrays[i],
          function(obj) {

        $(countrytrGenerator(obj)).appendTo($(arrays2[i]));

        for(countryRow of $(arrays2[i] + ' .countryRow')) {

          var targetCityRow = $(countryRow).children().eq(1);
          var countryNameforRow = $(countryRow).attr('id');
          $.getJSON('../../app/json/tour/regCity?country=' + countryNameforRow, 
              function(data) {
            $(citytrGenerator(data)).appendTo($(targetCityRow));
          });
        }

        $(document.body).trigger('nav-list');
      });
      $.ajaxSetup({async:true});
    } 
  };



