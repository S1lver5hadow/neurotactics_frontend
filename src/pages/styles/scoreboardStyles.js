
const scoreboardStyles = {
  container: {
    width: '90%',
    margin: '20px auto',
    backgroundColor: '#1a1a1a',
    borderRadius: '10px',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: '20px',
  },
  teamsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
  },
  teamTable: {
    width: '48%',
  },
  row: {
    textAlign: 'center',
    borderBottom: '1px solid #333',
    padding: '10px 0',
  },
  iconCell: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  playerIcon: (team) => ({
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: `3px solid ${team === 100 ? 'blue' : 'red'}`,
  }),
  playerName: {
    marginTop: '5px',
    fontSize: '14px',
    color: '#fff',
  },
  kdaCell: {
    padding: '10px',
  },
  kdaText: {
    fontSize: '16px',
    color: '#fff',
  },
  itemsCell: {
    display: 'flex',
    justifyContent: 'center',
    gap: '5px',
  },
  itemIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '4px',
    backgroundColor: '#000',
  },
  trinketIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '4px',
    border: '1px solid gold',
    backgroundColor: '#000',
  },
  headerCell: {
    padding: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
    borderBottom: '2px solid #444',
  },
  teamHeader: (team) => ({
    textAlign: 'center',
    padding: '10px 0',
    color: team,
    fontSize: '18px',
    fontWeight: 'bold',
  }),
};


export default scoreboardStyles;
