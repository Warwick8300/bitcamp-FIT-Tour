var param = location.href.split('?')[1];
var faqNo;    

if(param) {
  $('#update-btn').removeClass('bit-invisible');
  faqNo = param.split('=')[1];
  loadDate(faqNo);
} else {
  $('#add-btn').removeClass('bit-invisible');
}


var quill = new Quill('#editor', {
  modules: {
    toolbar: [
//      [{ 'font': [] }],
//      [{ 'size': ['small', false, 'large', 'huge'] }], 
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],  
//      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//      [{ 'indent': '-1' }, { 'indent': '+1' }],      
//      [{ 'align': [] }],
      ['image', 'link']
      ],imageResize: {}, 
  },
  placeholder: '내용을 입력해 주세요',

  theme: 'snow'  // or 'bubble'

});


$('#add-btn').click((e) => {
  if($('#faq-categories option:selected').html() == '카테고리 선택') {
    $('faq-categories option:selected').focus();
    M.toast({html: '카테고리를 선택 해 주세요'})
  } else if(!$('#input-title').val() || $('#input-title').val().replace(/\s/g,"").length == 0) {
    $('#input-title').focus();
    $('.titleLabel').addClass('warning');
    M.toast({html: '제목을 입력 해 주세요'})
  } else if($('.ql-editor').html() == '<p><br></p>') {
    $('.ql-editor').focus();
    M.toast({html: '내용을 입력 해 주세요'})
  } 
  
  else {
  $.post('../../app/json/faq/add', {
     category: $('#faq-categories option:selected').html(),
     title: $('#input-title').val(),
     content: $('.ql-editor').html()
  },

  function(data) {
    if(data.status == 'success') {
      location.href = "index.html";  
    } else {
      alert('등록 실패 입니다.\n' + data.message);
    }
  });
  } 
});


$('.ql-editor').click((e) => {
  $('.titleLabel').removeClass('warning');
});

$('#update-btn').click(() => {
  
  if(!$('#input-title').val() || $('#input-title').val().replace(/\s/g,"").length == 0) {
    $('#input-title').focus();
    $('.titleLabel').addClass('warning');
    M.toast({html: '제목을 입력 해 주세요'})
  } else if($('.ql-editor').html() == '<p><br></p>') {
    $('.ql-editor').focus();
    M.toast({html: '내용을 입력 해 주세요'})
  } 
  
  $.post('../../app/json/faq/update?no=' + faqNo,
      {
      category: $('#faq-categories option:selected').html(),
      title: $('#input-title').val(),
      content: $('.ql-editor').html()
      
      },
  function(data) {
        if(data.status == 'success') {
        location.href = "index.html?faq";  
      } else {
        alert('수정 실패 입니다.\n' + data.message);
      }
      })
});


$('h2').click(() => {
  location.href = "index.html";
});

function loadDate(faqNo) {
  $.getJSON('../../app/json/faq/detail?no=' + faqNo,
   function(data) {

    $('option').each(function (index, item) {
      if($(item).html() == data.category)
        $(item).attr('selected', '');
    });
    $('#input-title').val(data.title);
    $('.ql-editor').html(data.content);
  })
  $('#input-title').focus();
};
  
