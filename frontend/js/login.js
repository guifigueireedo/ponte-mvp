(function(){
        const $ = (s, r=document) => r.querySelector(s);
        const form = $('#loginForm');
        const email = $('#email');
        const senha = $('#senha');
        const robot = $('#robot');
        const toastEl = $('#toast');

        function toast(msg, type){
          toastEl.textContent = msg;
          toastEl.className = 'toast show ' + (type||'');
          setTimeout(()=>toastEl.className='toast', 2200);
        }
        function showError(id, msg){
          const el = document.getElementById(id+'-error');
          if(!el) return;
          el.textContent = msg; el.hidden = !msg;
        }

        document.querySelectorAll('.eye').forEach(btn => {
          btn.addEventListener('click', () => {
            const t = document.getElementById(btn.dataset.target);
            if (!t) return;
            t.type = t.type === 'password' ? 'text' : 'password';
          });
        });

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          let ok = true;
          showError('email',''); showError('senha',''); showError('captcha','');
          if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) { showError('email','Email inválido'); ok = false; }
          if (senha.value.length < 8) { showError('senha','Mín. 8 caracteres'); ok = false; }
          if (!robot.checked) { showError('captcha','Confirme que você não é um robô'); ok = false; }
          if (!ok) { toast('Confere os campos','error'); return; }
          toast('Login realizado!','success');
          setTimeout(()=>{ window.location.href = 'chat.html'; }, 700);
        });

        $('#closeBtn').addEventListener('click', ()=> toast('Saída!'));
        $('#helpBtn').addEventListener('click', ()=> toast('Precisa de ajuda? Estamos aqui 🦀'));
      })();