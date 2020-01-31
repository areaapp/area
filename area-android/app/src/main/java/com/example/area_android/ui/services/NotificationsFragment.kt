package com.example.area_android.ui.services

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.example.area_android.R

class ServicesFragment : Fragment() {

    private lateinit var servicesViewModel: ServicesViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        servicesViewModel =
            ViewModelProviders.of(this).get(ServicesViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_services, container, false)
        val textView: TextView = root.findViewById(R.id.text_services)
        servicesViewModel.text.observe(this, Observer {
            textView.text = it
        })
        return root
    }
}