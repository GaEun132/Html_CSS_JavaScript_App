//전역변수
const API_BASE_URL = "http://localhost:8080";

//DOM 엘리먼트 가져오기
const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");

//Document Load 이벤트 처리하기
document.addEventListener("DOMContentLoaded",function() {
    loadBooks();
});

//bookForm의 Submit 이벤트 처리하기
bookForm.addEventListener("submit", function(event){
    //기본으로 설정된 Event가 동작하지 않도록 하기 위함
    event.preventDefault();
    console.log("Form이 제출 되었음...");

    //FormData 객체 생성 <form>엘리먼트를 객체로 변환
    const bookFormData = new FormData(bookForm);
    bookFormData.forEach((value, key) => {
    console.log(key+'=' + value);
    });
        
    //사용자 정의 Book Object literal 객체 생성 (공백 제거 trim())
    const bookData = {
        title: bookFormData.get("title").trim(),
        author: bookFormData.get("author").trim(),
        isbn: bookFormData.get("isbn").trim(),
        price: bookFormData.get("price").trim(),
        publishDate: bookFormData.get("publishDate").trim(),
        // detailRequest: {
        //             description: bookFormData.get("description").trim(),
        //             language: bookFormData.get("language").trim(),
        //             pageCount: bookFormData.get("pageCount").trim(),
        //             publisher: bookFormData.get("publisher") || null,
        //             coverImageUrl: bookFormData.get("coverImageUrl").trim(),
        //             edition: bookFormData.get("edition").trim(),
        //         }

    }

    

    //유효성 체크하는 함수 호출하기
    if (!validateBook(bookData)) {
        //검증체크 실패하면 리턴하기
        return;
    }

    //유효한 데이터 출력하기
    console.log(bookData);


});


//입력항목의 값의 유효성을 체크하는 함수
function validateBook(book) {// 필수 필드 검사
    if (!book.title) {
        alert("제목을 입력해주세요.");
        return false;
    }

    if (!book.author) {
        alert("저자를 입력해주세요.");
        return false;
    }

    if (!book.isbn) {
        alert("ISBN을 입력해주세요.");
        return false;
    }

    const isbnPattern = /^(978|979)[0-9]{10}$/;
    if (!isbnPattern.test(book.isbn)) {
        alert("ISBN은 13자리 숫자입니다.");
        return false;
    }

    if (!book.price) {
        alert("가격을 입력해주세요.");
        return false;
    }

    if (!book.publishDate) {
        alert("출판일을 입력해주세요.");
        return false;
    }

    const publishDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!publishDatePattern.test(book.publishDate)) {
        alert("출판일의 형식은 0000-00-00입니다.");
        return false;
    }


    // if (book.detailRequest) {
    //     const bookDetail = book.detailRequest;
    //     if (!bookDetail.description) {
    //         alert("설명을 입력해주세요.");
    //         return false;
    //     }

    //     if (!bookDetail.language) {
    //         alert("언어를 입력해주세요.");
    //         return false;
    //     }

    //     if (!bookDetail.pageCount) {
    //         alert("페이지 수를 입력해주세요.");
    //         return false;
    //     }

    //     if (!bookDetail.publisher) {
    //         alert("출판사를 입력해주세요.");
    //         return false;
    //     }

    //     if (!bookDetail.coverImageUrl) {
    //         alert("표지를 입력해주세요.");
    //         return false;
    //     }

    //     if (!bookDetail.edition) {
    //         alert("버전을 입력해주세요.");
    //         return false;
    //     }

    // }
    return true;
}//validateBook



//Book 목록을 Load 하는 함수
function loadBooks() {
    console.log("책 목록 Load 중.....");
    fetch(`${API_BASE_URL}/api/books`) //Promise
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                throw new Error(`${errorData.message}`);
            }
            return response.json();
        })
        .then((books) => renderBookTable(books))
        .catch((error) => {
            console.log(error);
            alert(">>> 도서 목록을 불러오는데 실패했습니다!.");
            bookTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: #dc3545;">
                        오류: 데이터를 불러올 수 없습니다.
                    </td>
                </tr>
            `;
        });
};

function renderBookTable(books) {
    console.log(books);
    bookTableBody.innerHTML = "";
    // [{},{},{}] [] - books, {} - book
    books.forEach((book) => {
        //<tr> 엘리먼트를 생성하기 
        const row = document.createElement("tr");

        //<tr>의 content을 동적으로 생성
        row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td>${book.price}</td>
                    <td>${book.publishDate}</td>
                    
                    
                `;
        //<tbody>의 아래에 <tr>을 추가시켜 준다.
        bookTableBody.appendChild(row);
    });
}//renderBookTable

//<td>${book.detail ? book.detail.description : "-"}</td>
//                    <td>${book.detail?.language ?? "-"}</td>
//                    <td>${book.detail?.pageCount ?? "-"}</td>
//                    <td>${book.detail?.publisher ?? "-"}</td>
//                    <td>${book.detail?.coverImageUrl ?? "-"}</td>
//                    <td>${book.detail?.edition ?? "-"}</td>