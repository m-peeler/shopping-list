import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import store from './reduxState/store.tsx'
import './App.css'
import { useEffect, useState } from 'react'
import { Modal } from './components/Modal.tsx'
import { ShoppingList } from './components/ShoppingList.tsx'
import { useAppDispatch } from './reduxState/reduxHooks.ts'
import { setUsername } from './reduxState/entriesSlice.ts'
import { CookiesProvider, useCookies } from 'react-cookie';
import { UserHeader } from './components/UserHeader.tsx'
import { UsernameSubmissionPortal } from './components/UsernameSubmissionPortal.tsx'

function TopLevel() {

  const [modalOpened, setModalOpened] = useState(true);
  const [cookies] = useCookies(["username"]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (cookies.username !== undefined && cookies.username !== "undefined") {
      dispatch(setUsername(cookies.username))
      setModalOpened(false)
    }
  }, [dispatch, cookies.username])

  return <div style={{padding: 0, margin: 0}}>   
    <UserHeader modalOpened={modalOpened} launchModal={() => setModalOpened(true)} />
    <ShoppingList />
    <Modal 
      openModal={modalOpened} 
      closeModal={() => setModalOpened(false)} 
    >
      <UsernameSubmissionPortal closeModal={() => setModalOpened(false)}/>
    </Modal>
  </div>
}

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <TopLevel />
        </CookiesProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
