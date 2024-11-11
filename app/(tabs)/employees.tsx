import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator, ScrollView, SafeAreaView,  Modal, Switch} from 'react-native';
import { Surface } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

import { User, ApiEmployeesResponse } from '@/lib/types';

const sortOptions = [
  { label: 'Número', value: 'employeeNumber' },
  { label: 'Más reciente', value: 'modifiedAt' },
  { label: 'Más antiguo', value: 'createdAt' },
  { label: 'Nombre', value: 'fullName' },
  { label: 'Apellido', value: 'lastName' },
  { label: 'Correo electrónico', value: 'email' },
];

const filterOptions = {
  remunerationType: { "Jornalero": "Jornalero", "Por hora": "hourly" },
  position: { "Manager": "manager", "Developer": "developer", "Designer": "designer" },
  section: { "Dev": "Dev", "Marketing": "marketing", "IT": "it" },
  workshift: { "Mañana": "8-16", "Tarde": "afternoon", "Noche": "night" },
  isActive: { "Activo": "true", "Inactivo": "false" },
  nationality: { "Paraguaya": "Paraguaya", "Aleman": "Aleman", "Canadiense": "Canadiense" },
  role: { "Funcionario": "Funcionario", "Supervisor": "Supervisor" },
};



const EmployeesPage = () => {

  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('modifiedAt');
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false); 
  const [filters, setFilters] = useState({
    year: null as number | null,
    remunerationType: null as string | null,
    position: null as string | null,
    section: null as string | null,
    workshift: null as string | null,
    isActive: null as boolean | null,
    nationality: null as string | null,
    role: null as string | null,
  });
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);

  const fetchEmployees = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const queryString = new URLSearchParams({
        page: page.toString(),
        sort: sortOrder,
        search: searchQuery,
        remunerationType: filters.remunerationType || '',
        position: filters.position || '',
        section: filters.section || '',
        workshift: filters.workshift || '',
        isActive: filters.isActive !== null ? filters.isActive.toString() : '',
        nationality: filters.nationality || '',
        role: filters.role || '',
      });

      const response = await fetch(`https://api.schneck.dlab.software/api/users?${queryString.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data: ApiEmployeesResponse = await response.json();
      setNumPages(data.numPages);
      setUsers(data.results || []);
    } catch (error) {
      console.error("Error fetching receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, sortOrder, searchQuery, filters, token]);

  
  // Handle opening and closing the filter panel
  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  // Update individual filter
  const updateFilter = (key: keyof typeof filters, value: any) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      year: null,
      remunerationType: null,
      position: null,
      section: null,
      workshift: null,
      isActive: null,
      nationality: null,
      role: null,
    });
    setShowFilterPanel(false); // Close the filter panel
  };
  

  // Pagination Control
  const goToNextPage = () => {
    if (page < numPages) setPage(prevPage => prevPage + 1);
  };

  const goToPreviousPage = () => {
    if (page > 1) setPage(prevPage => prevPage - 1);
  };
  
  // Render each receipt row
  const renderEmployees = (user: User) => (
    <View key={user.id} className='flex-row items-center bg-white p-3 '>
      <Text className='p-1' style={{ minWidth: 80, flex: 1 }}>{user.employeeNumber}</Text>
      <Text className='p-1' style={{ minWidth: 160, flex: 2 }}>{user.fullName}</Text>
      <Text className='p-1' style={{ minWidth: 150, flex: 2 }}>{user.email}</Text>
      <Text className='p-1' style={{ minWidth: 80, flex: 2 }}>{user.phoneNumber}</Text>
      <View style={{ minWidth: 80, flex: 1, alignItems: 'center' }}>
        {user?.isActive ? (
          <MaterialIcons name="done" size={20} color="green" />
        ) : (
          <MaterialIcons name="close" size={20} color="red" />
        )}
      </View>
    </View>
  );

  return (
      
    <SafeAreaView  className='flex-1'>
      {/* Header */}
      <Surface 
        className='flex-col mb-4 p-4 bg-white'
        style={{ elevation: 2 }}
      >
        <View className="flex-row space-x-2 mb-4">
          <Text className="text-2xl font-bold">Lista de empleados</Text>
          <View className="bg-blue-500 px-4 py-1 rounded-full">
            <Text className="text-white text-sm">{users?.length ?? 0}</Text>
          </View>
        </View>
        <View className='flex-row'>
          <TouchableOpacity 
            className='border p-3 rounded-lg mr-4 mb-4'
          >
            <Text className='text-black font-semibold'>IMPORTAR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className='bg-blue-500 p-3 rounded-lg mr-4 mb-4'
          >
            <Text className='text-white font-semibold'>+ NUEVO EMPLEADO</Text>
          </TouchableOpacity>
        </View>
      </Surface>

      

      <View className='flex-1 bg-gray-100 p-4'>
        <View className='flex-row justify-between items-center mb-4'>
          {/* Sort Order Button */}
          <TouchableOpacity onPress={() => setShowSortOptions(!showSortOptions)} className="flex-row items-center">
            <Text className="text-black">{sortOptions.find(option => option.value === sortOrder)?.label || 'Ordenar'}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>
          
          {/* Filter Button */}
          <TouchableOpacity onPress={toggleFilterPanel}>
            <Text className='text-blue-500'>Agregar filtro +</Text>
          </TouchableOpacity>
        </View>

        {showSortOptions && (
          <View className="absolute top-16 left-4 right-4 bg-white shadow-md rounded-md z-10">
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setSortOrder(option.value);
                  setShowSortOptions(false);
                }}
                className="p-3 border-b border-gray-200"
              >
                <Text className="text-black">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}




        {/* Search Bar */}
        <TextInput
          className='bg-white p-3 rounded-lg mb-4'
          placeholder="Buscar Empleados"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <Modal visible={showFilterPanel} transparent={true} animationType="slide">
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-6 rounded-lg w-80">
              <Text className="text-lg font-bold mb-4">Filtrar empleados</Text>

              {/* Sección Dropdown */}
              <Text className="mb-2">Sección</Text>
              <Picker
                selectedValue={filters.section}
                onValueChange={(value) => updateFilter('section', value)}
                style={{ marginBottom: 12, backgroundColor: 'gray-200' }}
              >
                <Picker.Item label="Seleccione una opción" value={null} />
                {Object.entries(filterOptions.section).map(([label, value]) => (
                  <Picker.Item label={label} value={value} key={value} />
                ))}
              </Picker>

              {/* Turno Dropdown */}
              <Text className="mb-2">Turno</Text>
              <Picker
                selectedValue={filters.workshift}
                onValueChange={(value) => updateFilter('workshift', value)}
                style={{ marginBottom: 12, backgroundColor: 'gray-200' }}
              >
                <Picker.Item label="Seleccione una opción" value={null} />
                {Object.entries(filterOptions.workshift).map(([label, value]) => (
                  <Picker.Item label={label} value={value} key={value} />
                ))}
              </Picker>

              {/* Estado Switch */}
              <Text className="mb-2">Estado</Text>
              <Picker
                selectedValue={filters.isActive}
                onValueChange={(value) => updateFilter('isActive', value)}
                style={{ marginBottom: 12, backgroundColor: 'gray-200' }}
              >
                <Picker.Item label="Seleccione una opción" value={null} />
                {Object.entries(filterOptions.isActive).map(([label, value]) => (
                  <Picker.Item label={label} value={value} key={value} />
                ))}
              </Picker>

              {/* Nacionalidad Dropdown */}
              <Text className="mb-2">Nacionalidad</Text>
              <Picker
                selectedValue={filters.nationality}
                onValueChange={(value) => updateFilter('nationality', value)}
                style={{ marginBottom: 12, backgroundColor: 'gray-200' }}
              >
                <Picker.Item label="Seleccione una opción" value={null} />
                {Object.entries(filterOptions.nationality).map(([label, value]) => (
                  <Picker.Item label={label} value={value} key={value} />
                ))}
              </Picker>

              {/* Rol Dropdown */}
              <Text className="mb-2">Rol</Text>
              <Picker
                selectedValue={filters.role}
                onValueChange={(value) => updateFilter('role', value)}
                style={{ marginBottom: 12, backgroundColor: 'gray-200' }}
              >
                <Picker.Item label="Seleccione una opción" value={null} />
                {Object.entries(filterOptions.role).map(([label, value]) => (
                  <Picker.Item label={label} value={value} key={value} />
                ))}
              </Picker>

              {/* Apply and Clear Filters Buttons */}
              <TouchableOpacity onPress={toggleFilterPanel} className="bg-blue-500 p-2 rounded-lg mt-4">
                <Text className="text-white text-center">Aplicar filtros</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={clearFilters} className="bg-red-500 p-2 rounded-lg mt-2">
                <Text className="text-white text-center">Borrar filtros</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Employee List */}
        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <ScrollView 
              horizontal
              contentContainerStyle={{ flexDirection: 'column' }}
            >
              <View
                className='bg-blue-500 p-3 rounded-t-lg flex-row' 
                style={{ height: 50, maxHeight:50 }}
              >
                <Text className='text-white text-start' style={{ minWidth: 80, flex: 1 }}>Número</Text>
                <Text className='text-white text-start' style={{ minWidth: 160, flex: 2 }}>Nombre</Text>
                <Text className='text-white text-start' style={{ minWidth: 150, flex: 2 }}>Correo Electrónico</Text>
                <Text className='text-white text-start' style={{ minWidth: 80, flex: 1 }}>Teléfono</Text>
                <Text className='text-white text-start' style={{ minWidth: 80, flex: 1 }}>Estado</Text>
              </View>
              {users.map(renderEmployees)}
            </ScrollView>
        )}

        {/* Pagination */}
        <View className='flex-row justify-center items-center mt-4'>
          <TouchableOpacity onPress={goToPreviousPage} disabled={page === 1} className='p-2'>
            <MaterialIcons name="navigate-before" size={24} color={page === 1 ? 'gray' : 'black'} />
          </TouchableOpacity>
          <Text className='mx-4'>{page}</Text>
          <TouchableOpacity onPress={goToNextPage} disabled={page === numPages} className='p-2'>
            <MaterialIcons name="navigate-next" size={24} color={page === numPages ? 'gray' : 'black'} />
          </TouchableOpacity>
        </View>

      </View>      
    </SafeAreaView>
  );
};

export default EmployeesPage;