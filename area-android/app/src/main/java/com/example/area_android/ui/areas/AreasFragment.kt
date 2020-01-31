package com.example.area_android.ui.areas

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.example.area_android.R

class AreasFragment : Fragment() {

    private lateinit var areasViewModel: AreasViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        areasViewModel =
            ViewModelProviders.of(this).get(AreasViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_areas, container, false)
        val textView: TextView = root.findViewById(R.id.text_areas)
        areasViewModel.text.observe(this, Observer {
            textView.text = it
        })
        return root
    }
}