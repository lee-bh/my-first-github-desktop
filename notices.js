// 공지사항 관련 함수들
function loadNotices() {
    const noticesRef = database.ref('notices');
    noticesRef.orderByChild('timestamp').limitToLast(10).on('value', (snapshot) => {
        const noticesContainer = document.getElementById('notices-container');
        noticesContainer.innerHTML = '';
        
        snapshot.forEach((childSnapshot) => {
            const notice = childSnapshot.val();
            const noticeElement = createNoticeElement(notice);
            noticesContainer.appendChild(noticeElement);
        });
    });
}

function createNoticeElement(notice) {
    const noticeDiv = document.createElement('div');
    noticeDiv.className = 'notice-item';
    
    const date = new Date(notice.timestamp);
    const formattedDate = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    noticeDiv.innerHTML = `
        <div class="notice-header">
            <span class="notice-title">${notice.title}</span>
            <span class="notice-date">${formattedDate}</span>
        </div>
        <div class="notice-content">${notice.content}</div>
    `;
    
    return noticeDiv;
}

// 관리자용 공지사항 작성 폼
function showNoticeForm() {
    const form = document.getElementById('notice-form');
    form.style.display = 'block';
}

function submitNotice(event) {
    event.preventDefault();
    
    const title = document.getElementById('notice-title').value;
    const content = document.getElementById('notice-content').value;
    
    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }
    
    const noticesRef = database.ref('notices');
    const newNoticeRef = noticesRef.push();
    
    newNoticeRef.set({
        title: title,
        content: content,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert('공지사항이 등록되었습니다.');
        document.getElementById('notice-form').reset();
        document.getElementById('notice-form').style.display = 'none';
    }).catch((error) => {
        console.error('Error writing notice: ', error);
        alert('공지사항 등록에 실패했습니다.');
    });
}

// 페이지 로드 시 공지사항 불러오기
document.addEventListener('DOMContentLoaded', () => {
    loadNotices();
    
    // 관리자용 폼 이벤트 리스너
    const noticeForm = document.getElementById('notice-form');
    if (noticeForm) {
        noticeForm.addEventListener('submit', submitNotice);
    }
}); 